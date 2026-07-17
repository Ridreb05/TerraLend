const { expect } = require("chai");
const { ethers } = require("hardhat");

const GRANT = 0;
const GREEN_LOAN = 1;
const oneDay = () => Math.floor(Date.now() / 1000) + 86400;

describe("TerraLend", function () {
  let TerraLend, terraLend, owner, backer1, backer2;

  beforeEach(async function () {
    TerraLend = await ethers.getContractFactory("TerraLend");
    [owner, backer1, backer2] = await ethers.getSigners();
    terraLend = await TerraLend.deploy();
    await terraLend.waitForDeployment();
  });

  it("creates a grant project", async function () {
    await terraLend.createProject(
      owner.address,
      "Community Solar Microgrid",
      "Install rooftop solar for a rural community center.",
      ethers.parseEther("10"),
      0,
      oneDay(),
      GRANT
    );

    const project = await terraLend.projects(0);
    expect(project.steward).to.equal(owner.address);
    expect(project.title).to.equal("Community Solar Microgrid");
    expect(project.target).to.equal(ethers.parseEther("10"));
    expect(project.model).to.equal(GRANT);
  });

  it("creates a green loan project", async function () {
    await terraLend.createProject(
      owner.address,
      "Regenerative Farm Expansion",
      "Scale a regenerative agriculture cooperative.",
      ethers.parseEther("5"),
      ethers.parseEther("6"),
      oneDay(),
      GREEN_LOAN
    );

    const project = await terraLend.projects(0);
    expect(project.repaymentAmount).to.equal(ethers.parseEther("6"));
    expect(project.model).to.equal(GREEN_LOAN);
  });

  it("lets backers fund a project", async function () {
    await terraLend.createProject(
      owner.address,
      "Reforestation Drive",
      "Plant 50,000 native trees across degraded land.",
      ethers.parseEther("10"),
      0,
      oneDay(),
      GRANT
    );

    await terraLend.connect(backer1).fundProject(0, { value: ethers.parseEther("1") });
    await terraLend.connect(backer2).fundProject(0, { value: ethers.parseEther("2") });

    const project = await terraLend.projects(0);
    expect(project.amountRaised).to.equal(ethers.parseEther("3"));

    const [backers, contributions] = await terraLend.getBackers(0);
    expect(backers[0]).to.equal(backer1.address);
    expect(contributions[0]).to.equal(ethers.parseEther("1"));
  });

  it("repays a green loan and marks it repaid", async function () {
    await terraLend.createProject(
      owner.address,
      "Clean Water Kiosk",
      "Deploy a solar-powered water purification kiosk.",
      ethers.parseEther("5"),
      ethers.parseEther("6"),
      oneDay(),
      GREEN_LOAN
    );

    await terraLend.connect(backer1).fundProject(0, { value: ethers.parseEther("3") });
    await terraLend.connect(backer2).fundProject(0, { value: ethers.parseEther("2") });

    await terraLend.connect(owner).repayLoan(0, { value: ethers.parseEther("6") });

    const project = await terraLend.projects(0);
    expect(project.isRepaid).to.equal(true);
  });

  it("reports the remaining amount", async function () {
    await terraLend.createProject(
      owner.address,
      "Wind Turbine Retrofit",
      "Retrofit an aging turbine with modern controls.",
      ethers.parseEther("10"),
      0,
      oneDay(),
      GRANT
    );

    await terraLend.connect(backer1).fundProject(0, { value: ethers.parseEther("4") });

    const remaining = await terraLend.getRemainingAmount(0);
    expect(remaining).to.equal(ethers.parseEther("6"));
  });
});
