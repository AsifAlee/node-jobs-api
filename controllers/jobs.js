const { StatusCodes } = require("http-status-codes");
const Job = require("../models/Job");
const { NotFoundError, BadRequestError } = require("../errors");

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    params: { id: jobId },
  } = req;
  console.log(jobId);

  const jobDelete = await Job.findByIdAndRemove({ _id: jobId });
  if (!jobDelete) {
    throw new NotFoundError("No job found with this id");
  }
  res.status(StatusCodes.OK).json({ msg: "Delete Success!" });
};

const updateJob = async (req, res) => {
  console.log(req.params);
  const {
    user: { userId },
    body: { company, position },
  } = req;

  if (!position || !company) {
    throw new BadRequestError("Please provide company and positon property");
  }
  const job = await Job.findByIdAndUpdate(
    { createdBy: userId, _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`No job found with the id ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs: jobs, totalJobs: jobs.length });
};
const getJob = async (req, res) => {
  const { userId } = req.user;
  const jobId = req.params.id;
  const job = await Job.find({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError("Job Not Found");
  }
  res.status(StatusCodes.OK).json({ job });
};
module.exports = {
  createJob,
  deleteJob,
  updateJob,
  getAllJobs,
  getJob,
};
