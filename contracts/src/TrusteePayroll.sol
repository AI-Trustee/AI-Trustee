// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TrusteePayroll
 * @notice On-chain audit trail for batch salary distributions.
 * @dev Deploy on X Layer (chainId 196) — zero gas.
 *      Records every payroll batch for transparency and verifiability.
 */
contract TrusteePayroll {
    struct PayrollRecord {
        uint40 timestamp;
        uint128 totalAmount;     // Total USDC distributed (6 decimals)
        uint16 recipientCount;   // Number of recipients in batch
        string batchId;          // Batch identifier (e.g. "2026-04-001")
        string memo;             // Human-readable note (e.g. "April 2026 Salary")
    }

    PayrollRecord[] public records;
    address public immutable admin;

    event PayrollExecuted(
        uint256 indexed id,
        string batchId,
        uint128 totalAmount,
        uint16 recipientCount
    );

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    /**
     * @notice Log a completed payroll batch.
     * @param totalAmount Total USDC distributed (6 decimals)
     * @param recipientCount Number of recipients paid
     * @param batchId Unique batch identifier
     * @param memo Human-readable description
     */
    function logPayroll(
        uint128 totalAmount,
        uint16 recipientCount,
        string calldata batchId,
        string calldata memo
    ) external onlyAdmin {
        uint256 id = records.length;
        records.push(PayrollRecord({
            timestamp: uint40(block.timestamp),
            totalAmount: totalAmount,
            recipientCount: recipientCount,
            batchId: batchId,
            memo: memo
        }));
        emit PayrollExecuted(id, batchId, totalAmount, recipientCount);
    }

    /**
     * @notice Get total number of payroll records.
     */
    function count() external view returns (uint256) {
        return records.length;
    }

    /**
     * @notice Get the most recent N payroll records.
     * @param n Number of records to return
     */
    function getRecent(uint256 n) external view returns (PayrollRecord[] memory) {
        uint256 len = records.length;
        uint256 start = len > n ? len - n : 0;
        PayrollRecord[] memory result = new PayrollRecord[](len - start);
        for (uint256 i = start; i < len; i++) {
            result[i - start] = records[i];
        }
        return result;
    }
}
