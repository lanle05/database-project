import React, { useState, useEffect } from "react";
import {

  CreditCard,

  Users,
  LogOut,
  PlusCircle,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  Save,
} from "lucide-react";

// --- Types (Matched to MySQL Database Columns) ---
type Student = {
  student_id: string;
  matric_no: string;
  first_name: string;
  last_name: string;
  department: string; // This comes from the JOIN in the backend
  level: string;
  gender: string;
  dob: string;
  status: string;
  email: string;
};

type Department = {
  dept_id: number;
  name: string;
};

export default function App() {
  const [view, setView] = useState<
    "login" | "dashboard" | "register" | "issue" | "verify" | "manage"
  >("login");

  // Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  // Login State
  const [currentUser, setCurrentUser] = useState<string>("");
  const [loginCreds, setLoginCreds] = useState({ username: "", password: "" });

  // Registration State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    departmentId: "",
    level: "",
    gender: "Male",
    dob: "",
    email: "",
  });

  // Verification State
  const [verifyId, setVerifyId] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);

  // Issue ID State
  const [selectedStudentForID, setSelectedStudentForID] =
    useState<Student | null>(null);

  // --- API Handlers ---

  // Fetch Data on Load or View Change
  useEffect(() => {
    if (
      view === "dashboard" ||
      view === "manage" ||
      view === "issue" ||
      view === "register"
    ) {
      fetchStudents();
      fetchDepartments();
    }
  }, [view]);

  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/students");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/departments");
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error("Failed to fetch departments", err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock login for prototype
    if (loginCreds.username && loginCreds.password) {
      setCurrentUser(loginCreds.username);
      setView("dashboard");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Student Registered Successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          departmentId: "",
          level: "",
          gender: "Male",
          dob: "",
          email: "",
        });
        setView("manage");
      } else {
        alert("Registration failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/verify/${verifyId}`);
      const data = await res.json();

      if (data.valid) {
        setVerificationResult(data.data); // Contains full student info from JOIN
      } else {
        setVerificationResult("not-found");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this student record?")) {
      try {
        await fetch(`http://localhost:3000/api/students/${id}`, {
          method: "DELETE",
        });
        fetchStudents(); // Refresh list
      } catch (err) {
        console.error(err);
      }
    }
  };

  // --- Views ---

  if (view === "login") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-blue-600">
          <div className="text-center mb-8">
            <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
              <Users size={32} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Student Identity System
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Group 8 - Authentication Portal
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="admin"
                value={loginCreds.username}
                onChange={(e) =>
                  setLoginCreds({ ...loginCreds, username: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••"
                value={loginCreds.password}
                onChange={(e) =>
                  setLoginCreds({ ...loginCreds, password: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            >
              Secure Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users size={20} className="text-blue-400" />
            SIMS Admin
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as: {currentUser}
          </p>
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setView("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition ${
              view === "dashboard" ? "bg-blue-600" : "hover:bg-slate-800"
            }`}
          >
            <div className="w-5">
              <Users size={18} />
            </div>{" "}
            Dashboard
          </button>
          <button
            onClick={() => setView("register")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition ${
              view === "register" ? "bg-blue-600" : "hover:bg-slate-800"
            }`}
          >
            <div className="w-5">
              <PlusCircle size={18} />
            </div>{" "}
            Register Student
          </button>
          <button
            onClick={() => setView("issue")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition ${
              view === "issue" ? "bg-blue-600" : "hover:bg-slate-800"
            }`}
          >
            <div className="w-5">
              <CreditCard size={18} />
            </div>{" "}
            Issue ID Card
          </button>
          <button
            onClick={() => setView("verify")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition ${
              view === "verify" ? "bg-blue-600" : "hover:bg-slate-800"
            }`}
          >
            <div className="w-5">
              <CheckCircle size={18} />
            </div>{" "}
            Verify Identity
          </button>
          <button
            onClick={() => setView("manage")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition ${
              view === "manage" ? "bg-blue-600" : "hover:bg-slate-800"
            }`}
          >
            <div className="w-5">
              <Edit size={18} />
            </div>{" "}
            Student Records
          </button>
          <button
            onClick={() => setView("login")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-red-900/50 text-red-200 mt-8 transition"
          >
            <div className="w-5">
              <LogOut size={18} />
            </div>{" "}
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Dashboard View */}
        {view === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-gray-500 text-sm">Total Students</div>
                <div className="text-3xl font-bold text-blue-600 mt-2">
                  {students.length}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-gray-500 text-sm">Active IDs</div>
                <div className="text-3xl font-bold text-green-600 mt-2">
                  {students.filter((s) => s.status === "Active").length}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-gray-500 text-sm">Departments</div>
                <div className="text-3xl font-bold text-purple-600 mt-2">
                  {new Set(students.map((s) => s.department)).size}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mt-8">
              <h3 className="font-semibold text-blue-800 mb-2">
                Welcome, Member 6
              </h3>
              <p className="text-blue-600">
                Dashboard now connected to MySQL. Real-time stats are shown
                above.
              </p>
            </div>
          </div>
        )}

        {/* Registration View */}
        {view === "register" && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                New Student Registration
              </h2>
              <p className="text-sm text-gray-500">
                Enter student details to generate ID and Matric Number.
              </p>
            </div>
            <form onSubmit={handleRegister} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-md bg-white"
                    required
                    value={formData.departmentId}
                    onChange={(e) =>
                      setFormData({ ...formData, departmentId: e.target.value })
                    }
                  >
                    <option value="">Select Department...</option>
                    {departments.map((d) => (
                      <option key={d.dept_id} value={d.dept_id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-md bg-white"
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                  >
                    <option value="">Select...</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="300">300</option>
                    <option value="400">400</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === "Male"}
                        onChange={() =>
                          setFormData({ ...formData, gender: "Male" })
                        }
                      />{" "}
                      Male
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === "Female"}
                        onChange={() =>
                          setFormData({ ...formData, gender: "Female" })
                        }
                      />{" "}
                      Female
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  disabled={loading}
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium flex items-center gap-2"
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save size={18} /> Register Student
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Issue ID View */}
        {view === "issue" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Issue ID Card</h2>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Student to Issue ID
              </label>
              <select
                className="w-full md:w-1/2 px-4 py-2 border rounded-md"
                onChange={(e) =>
                  setSelectedStudentForID(
                    students.find((s) => s.student_id === e.target.value) ||
                      null
                  )
                }
                value={selectedStudentForID?.student_id || ""}
              >
                <option value="">-- Choose Student --</option>
                {students.map((s) => (
                  <option key={s.student_id} value={s.student_id}>
                    {s.last_name}, {s.first_name} ({s.matric_no})
                  </option>
                ))}
              </select>
            </div>

            {selectedStudentForID && (
              <div className="mt-8 flex justify-center">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden w-[350px] border border-gray-300 relative">
                  <div className="bg-blue-800 p-4 text-center">
                    <h3 className="text-white font-bold text-lg uppercase tracking-wider">
                      University Student ID
                    </h3>
                    <p className="text-blue-200 text-xs">
                      Student Identity Management System
                    </p>
                  </div>

                  <div className="p-6 flex flex-col items-center">
                    <div className="w-32 h-32 bg-gray-200 rounded-full border-4 border-blue-50 mb-4 overflow-hidden flex items-center justify-center">
                      <Users size={64} className="text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {selectedStudentForID.last_name}
                    </h2>
                    <h3 className="text-lg text-gray-600">
                      {selectedStudentForID.first_name}
                    </h3>

                    <div className="w-full mt-6 space-y-2 text-sm">
                      <div className="flex justify-between border-b border-gray-100 py-1">
                        <span className="text-gray-500">Matric No:</span>
                        <span className="font-mono font-medium">
                          {selectedStudentForID.matric_no}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 py-1">
                        <span className="text-gray-500">Dept:</span>
                        <span className="font-medium">
                          {selectedStudentForID.department}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 py-1">
                        <span className="text-gray-500">ID Number:</span>
                        <span className="font-medium text-xs">
                          {selectedStudentForID.student_id}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 py-1">
                        <span className="text-gray-500">Expiry:</span>
                        <span className="font-medium text-red-600">
                          Valid (4 Yrs)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 flex justify-center">
                    <div className="h-8 w-4/5 bg-gray-800 mask-barcode flex items-center justify-center text-white text-[10px] tracking-[5px]">
                      ||| || ||| || |||
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Verification View */}
        {view === "verify" && (
          <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Verify Student Identity
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Student ID or Matric No..."
                className="flex-1 px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={verifyId}
                onChange={(e) => setVerifyId(e.target.value)}
              />
              <button
                onClick={handleVerify}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                {loading ? "Checking..." : "Verify"}
              </button>
            </div>

            {verificationResult === "not-found" && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
                <XCircle size={24} />
                <div>
                  <p className="font-bold">Identity Not Found</p>
                  <p className="text-sm">
                    No student record matches the provided ID.
                  </p>
                </div>
              </div>
            )}

            {verificationResult && verificationResult !== "not-found" && (
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      Valid Student Identity
                    </h3>
                    <p className="text-green-600 font-medium mb-4">
                      Active & Registered
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="block text-gray-500">Full Name</span>
                        <span className="font-medium">
                          {verificationResult.last_name},{" "}
                          {verificationResult.first_name}
                        </span>
                      </div>
                      <div>
                        <span className="block text-gray-500">Matric No</span>
                        <span className="font-mono">
                          {verificationResult.matric_no}
                        </span>
                      </div>
                      <div>
                        <span className="block text-gray-500">Department</span>
                        <span>{verificationResult.department}</span>
                      </div>
                      <div>
                        <span className="block text-gray-500">Expiry</span>
                        <span className="text-red-500">
                          {verificationResult.expiry_date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Management View */}
        {view === "manage" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Student Database Records
            </h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                      Department
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-700 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student) => (
                    <tr key={student.student_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">
                        {student.student_id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {student.last_name}, {student.first_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {student.department}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            student.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 p-1">
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(student.student_id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {students.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No students found in database.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
