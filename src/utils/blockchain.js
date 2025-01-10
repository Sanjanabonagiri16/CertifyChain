import { ethers } from 'ethers';

export const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp * 1000).toLocaleDateString();
};

export const generateCertificateHash = (certificateData) => {
  const encoded = ethers.utils.defaultAbiCoder.encode(
    ['address', 'string', 'uint256', 'uint256', 'string'],
    [
      certificateData.recipient,
      certificateData.courseName,
      certificateData.issueDate,
      certificateData.expiryDate || 0,
      certificateData.additionalData || ''
    ]
  );
  return ethers.utils.keccak256(encoded);
};

export const validateEthereumAddress = (address) => {
  try {
    ethers.utils.getAddress(address);
    return true;
  } catch {
    return false;
  }
};

export const parseBlockchainError = (error) => {
  if (error.code === 'ACTION_REJECTED') {
    return 'Transaction was rejected by the user';
  }
  
  if (error.code === 'INSUFFICIENT_FUNDS') {
    return 'Insufficient funds for transaction';
  }

  if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
    return 'Transaction may fail. Please check the input parameters';
  }

  if (error.data) {
    try {
      const errorData = error.data;
      if (typeof errorData === 'string' && errorData.includes('revert')) {
        const revertReason = errorData.split('revert ')[1];
        return revertReason || 'Transaction reverted';
      }
    } catch {
      // If parsing fails, return the default message
    }
  }

  return error.message || 'An error occurred while processing the transaction';
};

export const estimateGas = async (contract, method, args, from) => {
  try {
    const gasEstimate = await contract.estimateGas[method](...args, { from });
    // Add 20% buffer for safety
    return gasEstimate.mul(120).div(100);
  } catch (error) {
    console.error('Gas estimation error:', error);
    throw new Error('Failed to estimate gas. The transaction may fail.');
  }
};

export const waitForTransaction = async (provider, txHash, confirmations = 1) => {
  try {
    const receipt = await provider.waitForTransaction(txHash, confirmations);
    return receipt;
  } catch (error) {
    console.error('Transaction confirmation error:', error);
    throw new Error('Failed to confirm transaction');
  }
};

export const getNetworkDetails = async (provider) => {
  try {
    const network = await provider.getNetwork();
    return {
      name: network.name,
      chainId: network.chainId,
      ensAddress: network.ensAddress,
    };
  } catch (error) {
    console.error('Network detection error:', error);
    throw new Error('Failed to detect network');
  }
}; 