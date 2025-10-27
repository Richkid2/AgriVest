# AgriVest — Simple Guide (for everyone)

This is a friendly guide to understand and use our smart contracts. Think of AgriVest like an online farm market:
- Farmers post their farm projects.
- Investors put HBAR (the money) into projects they like.
- When a milestone (a goal) is done and approved, money is released to the farmer.

We are on Hedera Testnet (Chain ID 296). RPC: `https://testnet.hashio.io/api`.

These are the contracts (testnet):
- Platform (main): `0xA55C1617bDe31d17743434D19cf44D8cFe0E2FB4`
- Rewards (optional): `0x31052F57De0d0498FE18E34733b6B54f0038f2e3`

## Who does what

- Farmer (project owner)
  - Creates a project.
  - Uploads proof when a milestone is done.

- Investor (supporter)
  - Sends HBAR to invest in a project.
  - Can get a refund if the project fails or time runs out.

- Admin (platform team)
  - Approves milestones and releases money.
  - Can pause/unpause the platform.
  - Can change fees and minimum investment.

## Simple flow

1) Farmer makes a project.
2) Investors add HBAR to it.
3) Admin sets milestones. Farmer uploads proof when done.
4) Admin approves a milestone → money goes to farmer, fee goes to platform.
5) If a project fails or time ends, investors can get refunds.

## Important numbers

- Minimum invest: set in the contract (example: 10 HBAR).
- Platform fee: example 5% (set as basis points, 500 = 5%).

## What the app (frontend) calls

- Create a project (farmer): `createProject(metadataURI, fundingGoal, duration, expectedROI, htsRewardToken)`
- Invest HBAR (investor): `investInProject(projectId)` and send value in HBAR.
- Submit milestone proof (farmer): `submitMilestoneEvidence(projectId, milestoneId, evidenceURI)`
- Read info:
  - `getProject(projectId)`
  - `getProjectMilestones(projectId)`
  - `getTotalProjects()`
  - `getInvestorBalance(projectId, user)`

## What admins (backend/ops) call

- Add a milestone: `createMilestone(projectId, description, fundingPercentage, targetDate)`
- Approve a milestone: `approveMilestone(projectId, milestoneId)`
- Update settings: `updatePlatformConfig(feeBps, minInvestment, feeReceiver)`
- Pause/unpause: `emergencyPause()` / `emergencyUnpause()`
- Refunds (done by investors themselves): `processRefund(projectId)`

## Rewards (optional, later)

Rewards are extra tokens for users. This needs special Hedera steps, so we may enable it later.
- Make reward token: `createRewardToken(name, symbol, initialSupply, memo)` (admin)
- Create a staking pool: `createStakingPool(stakingDuration, apy)` (admin)
- Users can stake HBAR: `stakeHBAR(poolId)` and later `unstakeHBAR(poolId, amount)`

If we don’t set up rewards yet, you can ignore this section.

## Example user actions (in plain words)

- Farmer: “I want to post my farm project.”
  - Call `createProject(...)` with a link to the details (IPFS), how much HBAR is needed, how long, and the expected return.

- Investor: “I want to invest 10 HBAR.”
  - Call `investInProject(projectId)` and send 10 HBAR as value.

- Farmer: “I finished milestone 1. Here is proof.”
  - Call `submitMilestoneEvidence(projectId, 0, "ipfs://...")`.

- Admin: “I approve this milestone.”
  - Call `approveMilestone(projectId, 0)` → sends money to farmer and fee to platform.

- Investor: “The project failed. I want my HBAR back.”
  - Call `processRefund(projectId)` if the project is eligible.

## Where to find addresses

- Check `Smart-contracts/deployments/` for the latest JSON file. It shows the platform and rewards addresses used on testnet.

## Quick checklist

- Can you see projects and milestones? (use the read functions)
- Can a farmer create a project?
- Can an investor add HBAR?
- Can an admin approve a milestone and release funds?
- Refund works when a project fails or expires?

That’s it! If you follow this guide, you can connect the app to the contracts and make the basic flows work. When we turn on rewards later, we’ll share the extra steps.
