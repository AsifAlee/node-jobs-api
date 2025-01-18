const express = require("express");
const {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJob,
} = require("../controllers/jobs");
const router = express.Router();

router.route("/").post(createJob);
router.route("/").get(getAllJobs);
router.route("/:id").patch(updateJob);
router.route("/:id").delete(deleteJob);
router.route("/:id").get(getJob);

module.exports = router;
