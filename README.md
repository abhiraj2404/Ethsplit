# Project Name - Ethsplit

A decentralized expense-sharing app that leverages blockchain technology to provide transparent, secure, and automated management of shared expenses, ensuring fairness and accountability for everyone involved.

# Problem statement

Managing shared expenses in group activities, households, businesses, and other collaborative scenarios is often cumbersome and prone to disputes. Traditional expense management methods rely on manual tracking, trust, and centralized financial systems, leading to several issues like :

1. **Lack of Transparency**: In traditional methods, it's difficult to keep track of all expenses and contributions transparently. This lack of visibility can cause misunderstandings and disputes among participants.
2. **Inefficiency**: Manually tracking expenses, calculating shares, and settling payments is time-consuming and prone to errors.
3. **Trust Issues**: Trusting one individual to manage the expenses can be problematic, especially in larger groups where not everyone knows each other well.
4. **Centralized Control**: Relying on centralized financial systems or intermediaries (like banks or payment apps) can result in high transaction fees, delays, and dependency on third-party platforms.
5. **Security Risks**: Centralized systems are vulnerable to security breaches and fraud, putting users' financial information at risk.

# Solution

To address these issues, I propose a decentralized expense-sharing app that leverages blockchain technology to provide a transparent, secure, and automated solution for managing shared expenses. Our app will offer the following benefits:

1. **Transparency**: Every transaction and expense is recorded on a public blockchain, providing a clear and immutable record accessible to all participants. This eliminates any ambiguity and ensures that everyone can see who paid for what and how much.
2. **Automation**: Smart contracts automate the process of calculating shares and settling payments, reducing the need for manual intervention and minimizing errors.
3. **Trustless System**: By using blockchain, the app removes the need to trust a single individual to manage the expenses. The decentralized nature ensures that the system operates fairly and transparently without requiring trust in a central authority.
4. **Lower Fees**: Utilizing cryptocurrency for transactions can significantly reduce the fees associated with traditional financial systems, making it cost-effective for users.
5. **Security**: Blockchain technology ensures that all data is securely stored and protected against unauthorized access and tampering.

# Usecases

1. Group Travel and Vacation Expenses
2. Household Expenses among roommates 
3. Event Planning involving multiple contributors
4. Business or Startup Expense Management among founders or team members
5. Crowdfunding and Joint Investments
6. Freelance Collaborations among members to manage shared expenses and revenue.
7. Charity and Fundraising

# Technology Used

**Frontend Development:**

- **Vite + React**: The client-side application is built using Vite coupled with React.
- **Tailwind CSS**: Tailwind and some of its component libraries like flowbite, nextUI etc. for styling the application.

**Smart Contract Development:**

- **Solidity**: The smart contracts, which handle the core logic of expense sharing, voting, and settlement, are written in Solidity.
- **Hardhat**: To streamline the development process, Hardhat is used as the primary framework for writing, testing, and deploying smart contracts.

**Blockchain Interaction:**

- **Ethers.js**: The interaction between the frontend application and the blockchain is managed using Ethers.js.

**Deployment:**

- **Polygon Blockchain**: The application is deployed on the Polygon blockchain, chosen for its high scalability, fast transaction speeds, and low gas fees. This ensures that users can interact with the app without incurring high costs, providing a more accessible and efficient user experience.

**Additional Components:**

- **MetaMask**: Users will connect their wallets and manage their funds through MetaMask, a popular Ethereum wallet that supports decentralized applications.

