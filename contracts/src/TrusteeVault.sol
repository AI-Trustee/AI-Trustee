// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TrusteeVault
 * @notice Programmable trust fund management with time-lock, periodic, and milestone-based release.
 * @dev Deploy on X Layer (chainId 196) — zero gas.
 *      Tracks trust creation, release events, and status changes on-chain.
 */
contract TrusteeVault {
    enum ReleaseType { TIME_LOCK, PERIODIC, MILESTONE }
    enum TrustStatus { ACTIVE, COMPLETED, CANCELLED }

    struct Trust {
        address beneficiary;       // Who receives the funds
        uint128 totalAmount;       // Total locked amount (USDC, 6 decimals)
        uint128 releasedAmount;    // Amount already released
        uint40 startTime;          // Trust creation timestamp
        uint40 releaseInterval;    // Seconds between releases (e.g. 2592000 = 30 days)
        uint128 releasePerPeriod;  // Amount released per interval
        uint40 nextReleaseTime;    // Next eligible release timestamp
        ReleaseType releaseType;
        TrustStatus status;
        string description;        // Human-readable trust purpose
    }

    Trust[] public trusts;
    address public immutable admin;

    event TrustCreated(
        uint256 indexed trustId,
        address indexed beneficiary,
        uint128 totalAmount,
        ReleaseType releaseType
    );

    event FundsReleased(
        uint256 indexed trustId,
        uint128 amount,
        uint128 remaining
    );

    event TrustStatusChanged(
        uint256 indexed trustId,
        TrustStatus newStatus
    );

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    /**
     * @notice Create a new trust fund.
     * @param beneficiary Recipient address
     * @param totalAmount Total amount to lock (6 decimals)
     * @param releaseInterval Seconds between releases (0 for milestone type)
     * @param releasePerPeriod Amount per release cycle (0 for time-lock)
     * @param rType Release mechanism
     * @param desc Human-readable description
     */
    function createTrust(
        address beneficiary,
        uint128 totalAmount,
        uint40 releaseInterval,
        uint128 releasePerPeriod,
        ReleaseType rType,
        string calldata desc
    ) external onlyAdmin returns (uint256 trustId) {
        trustId = trusts.length;

        uint40 nextRelease;
        if (rType == ReleaseType.TIME_LOCK) {
            nextRelease = uint40(block.timestamp) + releaseInterval;
        } else if (rType == ReleaseType.PERIODIC) {
            nextRelease = uint40(block.timestamp) + releaseInterval;
        } else {
            nextRelease = 0; // Milestone: no automatic schedule
        }

        trusts.push(Trust({
            beneficiary: beneficiary,
            totalAmount: totalAmount,
            releasedAmount: 0,
            startTime: uint40(block.timestamp),
            releaseInterval: releaseInterval,
            releasePerPeriod: releasePerPeriod,
            nextReleaseTime: nextRelease,
            releaseType: rType,
            status: TrustStatus.ACTIVE,
            description: desc
        }));

        emit TrustCreated(trustId, beneficiary, totalAmount, rType);
    }

    /**
     * @notice Release funds from a trust (time-lock or periodic).
     * @dev For TIME_LOCK: releases full remaining amount after lock period.
     *      For PERIODIC: releases one period's worth and advances schedule.
     */
    function release(uint256 trustId) external onlyAdmin {
        Trust storage t = trusts[trustId];
        require(t.status == TrustStatus.ACTIVE, "Trust not active");

        uint128 remaining = t.totalAmount - t.releasedAmount;
        require(remaining > 0, "Nothing to release");

        uint128 releaseAmount;

        if (t.releaseType == ReleaseType.TIME_LOCK) {
            require(block.timestamp >= t.nextReleaseTime, "Lock period not elapsed");
            releaseAmount = remaining; // Release everything
        } else if (t.releaseType == ReleaseType.PERIODIC) {
            require(block.timestamp >= t.nextReleaseTime, "Next release not due");
            releaseAmount = t.releasePerPeriod > remaining ? remaining : t.releasePerPeriod;
            t.nextReleaseTime = uint40(block.timestamp) + t.releaseInterval;
        } else {
            revert("Use completeMilestone for MILESTONE type");
        }

        t.releasedAmount += releaseAmount;
        remaining = t.totalAmount - t.releasedAmount;

        if (remaining == 0) {
            t.status = TrustStatus.COMPLETED;
            emit TrustStatusChanged(trustId, TrustStatus.COMPLETED);
        }

        emit FundsReleased(trustId, releaseAmount, remaining);
    }

    /**
     * @notice Release funds for a milestone-based trust.
     * @param trustId Trust to release from
     * @param amount Amount to release for this milestone
     */
    function completeMilestone(uint256 trustId, uint128 amount) external onlyAdmin {
        Trust storage t = trusts[trustId];
        require(t.status == TrustStatus.ACTIVE, "Trust not active");
        require(t.releaseType == ReleaseType.MILESTONE, "Not milestone type");

        uint128 remaining = t.totalAmount - t.releasedAmount;
        require(amount <= remaining, "Amount exceeds remaining");

        t.releasedAmount += amount;
        remaining = t.totalAmount - t.releasedAmount;

        if (remaining == 0) {
            t.status = TrustStatus.COMPLETED;
            emit TrustStatusChanged(trustId, TrustStatus.COMPLETED);
        }

        emit FundsReleased(trustId, amount, remaining);
    }

    /**
     * @notice Cancel a trust and mark remaining funds for return.
     */
    function cancelTrust(uint256 trustId) external onlyAdmin {
        Trust storage t = trusts[trustId];
        require(t.status == TrustStatus.ACTIVE, "Trust not active");
        t.status = TrustStatus.CANCELLED;
        emit TrustStatusChanged(trustId, TrustStatus.CANCELLED);
    }

    /**
     * @notice Get trust details.
     */
    function getTrust(uint256 trustId) external view returns (Trust memory) {
        return trusts[trustId];
    }

    /**
     * @notice Get total number of trusts.
     */
    function getTrustCount() external view returns (uint256) {
        return trusts.length;
    }

    /**
     * @notice Get all active trusts.
     */
    function getActiveTrusts() external view returns (Trust[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < trusts.length; i++) {
            if (trusts[i].status == TrustStatus.ACTIVE) activeCount++;
        }

        Trust[] memory result = new Trust[](activeCount);
        uint256 idx = 0;
        for (uint256 i = 0; i < trusts.length; i++) {
            if (trusts[i].status == TrustStatus.ACTIVE) {
                result[idx++] = trusts[i];
            }
        }
        return result;
    }
}
