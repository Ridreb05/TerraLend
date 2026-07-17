// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

/// @title TerraLend — Decentralized Crowdlending for Climate & Impact Projects
/// @notice Backers fund climate and impact projects either as a Grant (non-repayable)
///         or as a Green Loan (repayable, with returns distributed pro-rata to backers).
/// @dev Reuses a single Project struct for both funding models via the FundingModel enum.
contract TerraLend {
    /// @notice The two ways a project can be funded.
    enum FundingModel {
        Grant, // Non-repayable impact contribution.
        GreenLoan // Repayable capital; backers receive returns on repayment.
    }

    struct Project {
        address steward; // The project owner / fund recipient.
        string title;
        string summary;
        uint256 target; // Funding goal, in wei.
        uint256 repaymentAmount; // Total owed to backers (Green Loans only).
        uint256 deadline; // Unix timestamp after which funding closes.
        uint256 amountRaised; // Total contributed so far, in wei.
        FundingModel model;
        address[] backers;
        uint256[] contributions;
        bool isRepaid;
        bool isWithdrawn;
    }

    mapping(uint256 => Project) public projects;

    uint256 public totalProjects = 0;

    event ProjectCreated(uint256 indexed id, address indexed steward, FundingModel model);
    event ProjectFunded(uint256 indexed id, address indexed backer, uint256 amount);
    event LoanRepaid(uint256 indexed id, uint256 totalRepaid);
    event FundsWithdrawn(uint256 indexed id, address indexed steward, uint256 amount);

    /// @notice Launch a new funding project.
    /// @return The id assigned to the newly created project.
    function createProject(
        address _steward,
        string memory _title,
        string memory _summary,
        uint256 _target,
        uint256 _repaymentAmount,
        uint256 _deadline,
        FundingModel _model
    ) public returns (uint256) {
        require(_deadline > block.timestamp, "Deadline must be in the future.");

        Project storage project = projects[totalProjects];
        project.steward = _steward;
        project.title = _title;
        project.summary = _summary;
        project.target = _target;
        project.repaymentAmount = _model == FundingModel.GreenLoan ? _repaymentAmount : 0;
        project.deadline = _deadline;
        project.amountRaised = 0;
        project.model = _model;
        project.isRepaid = false;
        project.isWithdrawn = false;

        uint256 id = totalProjects;
        totalProjects++;

        emit ProjectCreated(id, _steward, _model);
        return id;
    }

    /// @notice Back a project with ETH.
    function fundProject(uint256 _id) public payable {
        uint256 amount = msg.value;
        Project storage project = projects[_id];

        require(project.deadline > block.timestamp, "Funding window has closed.");
        require(project.amountRaised < project.target, "Funding target already met.");
        require(amount > 0, "Contribution must be greater than zero.");

        project.backers.push(msg.sender);
        project.contributions.push(amount);
        project.amountRaised += amount;

        emit ProjectFunded(_id, msg.sender, amount);
    }

    /// @notice Repay a Green Loan; returns are distributed pro-rata to each backer.
    function repayLoan(uint256 _id) public payable {
        Project storage project = projects[_id];
        require(project.model == FundingModel.GreenLoan, "Project is not a Green Loan.");
        require(!project.isRepaid, "Loan already repaid.");
        require(project.amountRaised >= project.target, "Loan target not yet reached.");
        require(msg.value >= project.repaymentAmount, "Insufficient repayment amount.");

        uint256 totalRepayment = project.repaymentAmount;
        uint256 totalRaised = project.amountRaised;

        for (uint256 i = 0; i < project.backers.length; i++) {
            address backer = project.backers[i];
            uint256 contribution = project.contributions[i];
            uint256 share = (contribution * totalRepayment) / totalRaised;

            (bool sent, ) = payable(backer).call{value: share}("");
            require(sent, "Failed to transfer returns to backer.");
        }

        project.isRepaid = true;
        emit LoanRepaid(_id, totalRepayment);
    }

    /// @notice Withdraw raised funds. Allowed when fully funded, or after the deadline.
    function withdrawFunds(uint256 _id) public {
        Project storage project = projects[_id];
        require(msg.sender == project.steward, "Only the steward can withdraw funds.");
        require(!project.isWithdrawn, "Funds already withdrawn.");

        if (project.amountRaised < project.target) {
            require(
                block.timestamp > project.deadline,
                "Cannot withdraw before the deadline unless fully funded."
            );
        }

        project.isWithdrawn = true;
        uint256 amount = project.amountRaised;

        (bool sent, ) = payable(project.steward).call{value: amount}("");
        require(sent, "Failed to withdraw funds.");

        emit FundsWithdrawn(_id, project.steward, amount);
    }

    function getTotalProjects() public view returns (uint256) {
        return totalProjects;
    }

    function isProjectFullyFunded(uint256 _id) public view returns (bool) {
        Project storage project = projects[_id];
        return project.amountRaised >= project.target;
    }

    function getRemainingAmount(uint256 _id) public view returns (uint256) {
        Project storage project = projects[_id];
        if (project.amountRaised >= project.target) {
            return 0;
        }
        return project.target - project.amountRaised;
    }

    function getProjectById(uint256 _id)
        public
        view
        returns (
            address steward,
            string memory title,
            string memory summary,
            uint256 target,
            uint256 repaymentAmount,
            uint256 deadline,
            uint256 amountRaised,
            FundingModel model,
            bool isRepaid,
            bool isWithdrawn
        )
    {
        Project storage project = projects[_id];
        return (
            project.steward,
            project.title,
            project.summary,
            project.target,
            project.repaymentAmount,
            project.deadline,
            project.amountRaised,
            project.model,
            project.isRepaid,
            project.isWithdrawn
        );
    }

    function getBackers(uint256 _id)
        public
        view
        returns (address[] memory, uint256[] memory)
    {
        return (projects[_id].backers, projects[_id].contributions);
    }

    function getProjects() public view returns (Project[] memory) {
        Project[] memory allProjects = new Project[](totalProjects);
        for (uint256 i = 0; i < totalProjects; i++) {
            allProjects[i] = projects[i];
        }
        return allProjects;
    }
}
