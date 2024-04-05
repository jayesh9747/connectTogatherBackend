const Exam=require("../models/Exam");

const getExamsByGrade = async (req, res) => {
    const { grade } = req.body;

    try {
        // Find all exams for the given grade
        const exams = await Exam.find({ grade });

        // Extract and return the exam names
        const examNames = exams.map((exam) => exam.examName);

        // Return the results
        res.json({ examNames });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSubjectsByExamName = async (req, res) => {
    const { examName } = req.body;

    try {
        // Find the exam with the given examName
        const exam = await Exam.findOne({examName }).populate('SubjectId');
        
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Extract and return the subject names
        const subjectName = exam.SubjectId.subjectName;
        // const subjectNames = exam.SubjectId.map((subject) => subject.subjectName);

        // Return the results
        res.json({ subjectName });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getMarksBySubjectId = async (req, res) => {
    const { subjectId } = req.body;

    try {
        // Find all exams for the given subject
        const exams = await Exam.find({ SubjectId: subjectId });

        // Calculate average marks for the class and student's marks in the subject
        let classTotalMarks = 0;
        let classTotalStudents = 0;
        let studentTotalMarks = 0;
        let studentTotalExams = 0;
        const studentMarks = {};

        exams.forEach((exam) => {
            exam.marksRecord.forEach((record) => {
                if (!studentMarks[record.rollNumber]) {
                    studentMarks[record.rollNumber] = 0;
                }

                studentMarks[record.rollNumber] += parseInt(record.marks, 10);
                studentTotalMarks += parseInt(record.marks, 10);
                studentTotalExams++;
            });

            classTotalMarks += exam.totalMarks * exam.marksRecord.length;
            classTotalStudents += exam.marksRecord.length;
        });

        const classAverageMarks = classTotalMarks / classTotalStudents;
        const studentAverageMarks = studentTotalMarks / studentTotalExams;

        // Return the results
        res.json({ classAverageMarks, studentMarks, studentAverageMarks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// const getStudentMarksAndAverage = async (req, res) => {
//     const { grade,rollNumber} = req.body;

//     try {
//         // Find all exams for the student
//         const exams = await Exam.find({grade:grade});
//         console.log(exams);

//         // Calculate average marks for the class and student's marks in each subject
//         let classTotalMarks = 0;
//         let classTotalStudents = 0;
//         let studentTotalMarks = 0;
//         let studentTotalExams = 0;
//         const studentMarks = {};

//         exams.forEach((exam) => {
//             exam.marksRecord.forEach((record) => {
//                 if (record.rollNumber === rollNumber) {
//                     studentTotalMarks += parseInt(record.marks, 10);
//                     studentTotalExams++;
//                 }

//                 classTotalMarks += exam.totalMarks;
//                 classTotalStudents++;
//             });

//             studentMarks[exam.SubjectId] = exam.marksRecord.find((record) => record.rollNumber === studentId)?.marks || 0;
//         });

//         const classAverageMarks = classTotalMarks / classTotalStudents;
//         const studentAverageMarks = studentTotalMarks / studentTotalExams;

//         // Return the results
//         res.json({ classAverageMarks, studentMarks, studentAverageMarks });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

module.exports = { getExamsByGrade,getSubjectsByExamName,getMarksBySubjectId };
