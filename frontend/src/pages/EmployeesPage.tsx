import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Employee, Department, Position } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Users, Plus, Search, Filter, Edit, Eye, UserX, Mail, Phone, Building, Shield } from 'lucide-react';

export const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationalId: '',
    taxId: '',
    bankAccount: '',
    bankName: '',
    departmentId: '',
    positionId: '',
    hireDate: new Date().toISOString().split('T')[0],
    role: 'EMPLOYEE',
  });

  const fetchData = async () => {
    try {
      const [empRes, deptRes, posRes] = await Promise.all([
        api.get('/employees'),
        api.get('/departments'),
        api.get('/positions'),
      ]);
      setEmployees(empRes.data);
      setDepartments(deptRes.data);
      setPositions(posRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/employees', formData);
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create employee');
    }
  };

  const filteredEmployees = employees.filter((e) => {
    const matchesSearch =
      `${e.firstName} ${e.lastName} ${e.employeeCode} ${e.email}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesDept = !deptFilter || e.departmentId === deptFilter;
    return matchesSearch && matchesDept;
  });

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Employees Directory...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            <span>Employee Directory</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Manage corporate workforce, profiles, and assignments</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg glow-indigo flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Employee</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, code, email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Employee Name</th>
              <th className="py-3 px-4">Department & Position</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Hire Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{emp.employeeCode}</td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {emp.firstName} {emp.lastName}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-200">{emp.department?.name || 'Unassigned'}</p>
                    <p className="text-[10px] text-slate-400">{emp.position?.title || 'N/A'}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-slate-300">{emp.email}</p>
                    <p className="text-[10px] text-slate-500">{emp.phone || 'No Phone'}</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {new Date(emp.hireDate).toISOString().split('T')[0]}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={emp.status === 'ACTIVE' ? 'success' : emp.status === 'PROBATION' ? 'warning' : 'danger'}>
                      {emp.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedEmp(emp)}
                      className="p-1.5 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-6 text-center text-slate-500">
                  No employees found matching filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Corporate Employee">
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Employee Code *</label>
              <input
                type="text"
                required
                value={formData.employeeCode}
                onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                placeholder="EMP-005"
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">System Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="EMPLOYEE">EMPLOYEE</option>
                <option value="MANAGER">MANAGER</option>
                <option value="HR_ADMIN">HR_ADMIN</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Department</label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Position</label>
              <select
                value={formData.positionId}
                onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="">Select Position</option>
                {positions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">National ID / Passport</label>
              <input
                type="text"
                value={formData.nationalId}
                onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Tax ID</label>
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Bank Account Number</label>
              <input
                type="text"
                value={formData.bankAccount}
                onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold glow-indigo"
            >
              Save Employee Record
            </button>
          </div>
        </form>
      </Modal>

      {/* View Employee Detail Modal */}
      {selectedEmp && (
        <Modal isOpen={!!selectedEmp} onClose={() => setSelectedEmp(null)} title={`Profile: ${selectedEmp.firstName} ${selectedEmp.lastName}`}>
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-white">{selectedEmp.firstName} {selectedEmp.lastName}</p>
                <p className="text-indigo-400 font-mono">{selectedEmp.employeeCode} • {selectedEmp.position?.title || 'No Position'}</p>
              </div>
              <Badge variant={selectedEmp.status === 'ACTIVE' ? 'success' : 'danger'}>{selectedEmp.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="text-slate-400 font-semibold">Email</p>
                <p className="text-white mt-1">{selectedEmp.email}</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="text-slate-400 font-semibold">Department</p>
                <p className="text-white mt-1">{selectedEmp.department?.name || 'N/A'}</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="text-slate-400 font-semibold">National ID</p>
                <p className="text-white mt-1">{selectedEmp.nationalId || 'N/A'}</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="text-slate-400 font-semibold">Tax ID</p>
                <p className="text-white mt-1">{selectedEmp.taxId || 'N/A'}</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="text-slate-400 font-semibold">Bank Info</p>
                <p className="text-white mt-1">{selectedEmp.bankName ? `${selectedEmp.bankName} - ${selectedEmp.bankAccount}` : 'N/A'}</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="text-slate-400 font-semibold">Hire Date</p>
                <p className="text-white mt-1">{new Date(selectedEmp.hireDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
