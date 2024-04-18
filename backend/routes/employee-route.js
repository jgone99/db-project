
const express = require("express")
const router = express.Router()

router.post("/employee/create-employee",
	(req, res, next) => {
		console.log(req.body)
	});

router.get("/", (req, res) => {

});

// router.route("/update-employee/:id").get((req, res) => {
// 	})

// 	.put((req, res, next) => {
// 		studentSchema.findByIdAndUpdate(
// 			req.params.id,
// 			{
// 				$set: req.body,
// 			},
// 			(error, data) => {
// 				if (error) {
// 					return next(error);
// 					console.log(error);
// 				} else {
// 					res.json(data);
// 					console.log("Student updated successfully !");
// 				}
// 			}
// 		);
// 	});

// // Delete Student
// router.delete("/delete-student/:id",
// 	(req, res, next) => {
// 		studentSchema.findByIdAndRemove(
// 			req.params.id, (error, data) => {
// 				if (error) {
// 					return next(error);
// 				} else {
// 					res.status(200).json({
// 						msg: data,
// 					});
// 				}
// 			});
// 	});

module.exports = router;
