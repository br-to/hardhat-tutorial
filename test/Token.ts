import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Token contract', () => {
  it('Deployment should assign the total supply of tokens to the owner', async () => {
    const [owner] = await ethers.getSigners();

    const hardhatToken = await ethers.deployContract('Token');

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });
});
