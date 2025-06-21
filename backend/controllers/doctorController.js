import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import appointmentModel from "../models/appointmentModel.js";

// change availability of doctor
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID is required" });
    }

    const docData = await doctorModel.findById(docId);
    if (!docData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      docId,
      { available: !docData.available },
      { new: true }
    );

    res.json({
      success: true,
      message: `Doctor marked as ${updatedDoctor.available ? 'Available' : 'Unavailable'}`,
      doctor: updatedDoctor, // optional
    });
  } catch (error) {
    console.error("Error changing availability:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// doctor list
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email']);

    res.json({ success: true, doctors })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// API for doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email })

    if (!doctor) {
      return res.json({ success: false, message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, doctor.password)

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
      res.json({ success: true, token })
    }
    else {
      res.json({ success: false, message: 'Incorrect Password!' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.docId;
    // console.log("docId", docId);

    const appointments = await appointmentModel
      .find({ docId })
      .maxTimeMS(3000); // Set query timeout to 3000ms (3 seconds)

    // console.log("appointments", appointments);
    res.json({ success: true, appointments });

  } catch (error) {
    console.log("MongoDB Query Timeout or Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
  try {
    const docId = req.docId;
    const { appointmentId } = req.body
    console.log("appointId from appointmentComplete : ", appointmentId)
    console.log("docId from appointmentComplete : ", docId)

    const appointmentData = await appointmentModel.findById(appointmentId)

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
      return res.json({ success: true, message: 'Appointment Completed' })
    }
    else {
      return res.json({ success: false, message: 'Mark failed' })
    }
  } catch (error) {
    console.log("MongoDB Query Timeout or Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// API to cancel appointment completed for doctor panel
const appointmentCancel = async (req, res) => {
  try {
    const docId = req.docId;
    const { appointmentId } = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
      return res.json({ success: true, message: 'Appointment Cancelled' })
    }
    else {
      return res.json({ success: false, message: 'Cancellation failed' })
    }
  } catch (error) {
    console.log("MongoDB Query Timeout or Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// API to get doctor dashboard data
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.docId;

    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    const patientSet = new Set();

    appointments.forEach(item => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }

      patientSet.add(item.userId); // Set ensures uniqueness
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patientSet.size,
      latestAppointments: [...appointments]
        .sort((a, b) => b.date - a.date) // Sort by latest date
        .slice(0, 5)
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get doctor profile 
const doctorProfile = async (req, res) => {
  try {
    const docId = req.docId
    // console.log(docId)
    const profileData = await doctorModel.findById(docId).select('-password')

    res.json({ success: true, profileData })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
}

// API to update doctor profile data from doc panel
const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.docId
    const { fees, address, available } = req.body

    await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

    res.json({ success: true, message: 'Profile Updated' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
}


export {
  changeAvailability,
  doctorList, loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile
};