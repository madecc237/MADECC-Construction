import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Plus, 
  Download, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileBadge,
  ArrowRight,
  ExternalLink,
  Calendar,
  Building2,
  FileDown,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { PermissionGate } from '../../components/admin/PermissionGate';

interface Contract {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  signedDate: string;
  expirationDate: string;
  amount: number;
  status: 'Active' | 'Pending' | 'Expired' | 'Terminated';
  party: string;
}

const mockContracts: Contract[] = [
  {
    id: 'C-2026-001',
    projectId: '101',
    projectName: 'Metropolis Plaza',
    title: 'Structural Engineering Framework',
    signedDate: '2025-11-20',
    expirationDate: '2026-11-20',
    amount: 4500000,
    status: 'Active',
    party: 'Atkins Global'
  },
  {
    id: 'C-2026-002',
    projectId: '102',
    projectName: 'Horizon Ocean Villas',
    title: 'Civil Construction Agreement',
    signedDate: '2026-02-15',
    expirationDate: '2026-06-15', // Nearing expiration
    amount: 12800000,
    status: 'Active',
    party: 'Emaar Properties'
  },
  {
    id: 'C-2026-003',
    projectId: '103',
    projectName: 'TechHub Data Center',
    title: 'HVAC Installation Sub-contract',
    signedDate: '2026-04-10',
    expirationDate: '2027-04-10',
    amount: 12000000,
    status: 'Pending',
    party: 'CoolTech Solutions'
  },
  {
    id: 'C-2026-004',
    projectId: '104',
    projectName: 'Skyline Heights',
    title: 'Glass Facade Installation',
    signedDate: '2026-01-05',
    expirationDate: '2027-01-05',
    amount: 8500000,
    status: 'Active',
    party: 'Glasco International'
  },
  {
    id: 'C-2026-005',
    projectId: '105',
    projectName: 'Emerald Gardens',
    title: 'Landscaping Master Contract',
    signedDate: '2025-09-12',
    expirationDate: '2026-09-12',
    amount: 3200000,
    status: 'Active',
    party: 'GreenScape Dynamics'
  },
  {
    id: 'C-2026-006',
    projectId: '106',
    projectName: 'Corporate Tower A',
    title: 'Electrical Systems Audit',
    signedDate: '2026-03-22',
    expirationDate: '2026-05-22', // Nearing expiration
    amount: 1500000,
    status: 'Active',
    party: 'VoltMaster Services'
  }
];

export default function AdminContracts() {
  const [contracts] = useState<Contract[]>(mockContracts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Contract['status'] | 'All'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleExportCSV = () => {
    const headers = ['Ref ID', 'Title', 'Project', 'Party', 'Amount', 'Signed', 'Expiration', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredContracts.map(c => [
        c.id,
        `"${c.title}"`,
        `"${c.projectName}"`,
        `"${c.party}"`,
        c.amount,
        c.signedDate,
        c.expirationDate,
        c.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `MADECC_Contracts_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = (contract: Contract) => {
    const doc = new jsPDF() as any;
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(234, 88, 12); // Orange-600
    doc.text('MADECC CONSTRUCTION', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('LEGAL ARCHIVES - SECURE DOCUMENT', 14, 28);
    
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text('CONTRACT AGREEMENT', 120, 20);
    doc.setFontSize(9);
    doc.text(`REF: ${contract.id}`, 120, 25);
    doc.text(`PROJECT: ${contract.projectName.toUpperCase()}`, 120, 30);
    doc.text(`PARTY: ${contract.party.toUpperCase()}`, 120, 35);
    
    doc.setDrawColor(234, 88, 12);
    doc.setLineWidth(1);
    doc.line(14, 40, 196, 40);
    
    // Info sections
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('CONTRACT TITLE:', 14, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(contract.title, 60, 50);
    
    doc.setFont('helvetica', 'bold');
    doc.text('PARTICIPATING PARTY:', 14, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(contract.party, 60, 60);
    
    doc.setFont('helvetica', 'bold');
    doc.text('AFFILIATED PROJECT:', 14, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(contract.projectName, 60, 70);

    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL VALUE:', 14, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(`${contract.amount.toLocaleString()} FCFA`, 60, 80);
    
    // Dates Table
    const tableColumn = ["Metric", "Value"];
    const tableRows = [
      ["Signed Date", contract.signedDate],
      ["Expiration Date", contract.expirationDate],
      ["Status", contract.status],
      ["Project ID", contract.projectId]
    ];

    autoTable(doc, {
      startY: 95,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [40, 40, 40] },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 20;
    
    // Certification
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('DIGITAL CERTIFICATION', 14, finalY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('This document is electronically verified and archived in the MADECC System.', 14, finalY + 6);
    doc.text(`Timestamp: ${new Date().toLocaleString()}`, 14, finalY + 12);
    
    doc.save(`Contract_${contract.id}.pdf`);
  };

  const isNearingExpiration = (dateStr: string) => {
    const expirationDate = new Date(dateStr);
    if (isNaN(expirationDate.getTime())) return false;
    const today = new Date();
    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 45;
  };

  const filteredContracts = contracts.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.party.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  const currentContracts = filteredContracts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateAgreement = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Agreement recorded in archives.');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">Legal Archives</h2>
          <p className="text-gray-400 mt-1">Repository of signed agreements and legal commitments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-xl font-bold uppercase tracking-widest text-xs hover:text-white transition-all shadow-md active:scale-95"
          >
            <Download size={16} />
            Export CSV
          </button>
          <PermissionGate allowedRoles={['CEO', 'FINANCIAL_OFFICER', 'ACCOUNTANT', 'SECRETARY']}>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 active:scale-95"
            >
              <Plus size={18} />
              New Agreement
            </button>
          </PermissionGate>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/40 border border-gray-800 p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search archives by title, party or project..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-600/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1">
            <button 
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-orange-600 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-orange-600 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              <List size={18} />
            </button>
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 focus:outline-none focus:border-orange-600 transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Expired">Expired</option>
            <option value="Terminated">Terminated</option>
          </select>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {currentContracts.map((contract) => (
            <motion.div 
              key={contract.id}
              whileHover={{ scale: 1.01 }}
              className={`group bg-black/40 border p-8 rounded-3xl relative overflow-hidden flex flex-col transition-all duration-300 ${
                isNearingExpiration(contract.expirationDate) 
                  ? 'border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]' 
                  : 'border-gray-800'
              }`}
            >
              {isNearingExpiration(contract.expirationDate) && (
                <div className="absolute top-4 right-4 z-30">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-1 px-2 bg-orange-600 rounded-md flex items-center gap-1 shadow-lg shadow-orange-600/30"
                  >
                    <AlertCircle size={10} className="text-white" />
                    <span className="text-[8px] font-black text-white uppercase tracking-tighter">Expiring Soon</span>
                  </motion.div>
                </div>
              )}
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileBadge size={80} className="text-orange-600" />
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-orange-600 border border-gray-800">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight italic leading-none">{contract.title}</h3>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Ref: {contract.id}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1 flex items-center gap-1">
                      <Building2 size={10} /> Affiliated Project
                    </p>
                    <Link 
                      to={`/admin/projects`}
                      className="text-sm font-bold text-white uppercase hover:text-orange-500 transition-colors flex items-center gap-1"
                    >
                      {contract.projectName}
                      <ExternalLink size={12} className="opacity-50" />
                    </Link>
                    <p className="text-[9px] text-gray-600 font-mono mt-1">PID: {contract.projectId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Contracting Party</p>
                    <p className="text-sm font-bold text-white uppercase">{contract.party}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-2 border-t border-gray-800/50">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1 flex items-center gap-1">
                      <Calendar size={10} /> Signed Date
                    </p>
                    <p className="text-xs font-bold text-gray-300">{contract.signedDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1 flex items-center gap-1 justify-end">
                      <Clock size={10} /> Expiration
                    </p>
                    <p className={`text-xs font-bold ${
                      isNearingExpiration(contract.expirationDate) ? 'text-red-500 animate-pulse' : 'text-gray-300'
                    }`}>
                      {contract.expirationDate}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-white italic tracking-tighter">{(contract.amount/1000000).toFixed(1)}M FCFA</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      contract.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                    }`}>
                      {contract.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FileBadge size={14} className="text-orange-600" />
                    Contract Verified
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleDownloadPDF(contract)}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-white hover:border-orange-600/50 transition-all hover:bg-orange-600/5"
                    >
                      <FileDown size={14} className="text-orange-600" />
                      PDF
                    </button>
                    <button className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-orange-600 hover:text-orange-500">
                      Review
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {currentPage === totalPages && (
            <div 
              onClick={() => setIsModalOpen(true)}
              className="border-2 border-dashed border-gray-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center group hover:border-orange-600/30 transition-all cursor-pointer min-h-[300px]"
            >
              <div className="p-4 bg-gray-900 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Plus size={32} className="text-gray-600 group-hover:text-orange-600" />
              </div>
              <h4 className="text-lg font-black text-white uppercase italic tracking-tight">Upload New Deed</h4>
              <p className="text-gray-500 text-xs font-medium max-w-[200px] mt-1">Add legal documentation to the secure MADECC archives.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-black/40 border border-gray-800 rounded-3xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/40">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Reference</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Title & Party</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Project</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Value (FCFA)</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Expiration</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/30">
                {currentContracts.map((contract) => (
                  <tr 
                    key={contract.id} 
                    className="group border-b border-gray-800/10 odd:bg-gray-900/10 hover:bg-orange-600/5 transition-all duration-300"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                          <FileText size={14} />
                        </div>
                        <span className="font-mono text-xs text-gray-400 group-hover:text-gray-200">{contract.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-black text-white uppercase italic tracking-tight group-hover:text-orange-500 transition-colors">{contract.title}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{contract.party}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-gray-300 uppercase">{contract.projectName}</p>
                      <p className="text-[9px] text-gray-600 font-mono">PID: {contract.projectId}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-black text-white italic tracking-tighter text-lg">{contract.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className={isNearingExpiration(contract.expirationDate) ? 'text-red-500 animate-pulse' : 'text-gray-500'} />
                        <span className={`text-xs font-bold ${isNearingExpiration(contract.expirationDate) ? 'text-red-500' : 'text-gray-400'}`}>
                          {contract.expirationDate}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button 
                          onClick={() => handleDownloadPDF(contract)}
                          className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-orange-600 hover:bg-orange-600 hover:text-white transition-all shadow-lg shadow-black/40"
                          title="Download Archives"
                        >
                          <FileDown size={16} />
                        </button>
                        <button className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white transition-all shadow-lg shadow-black/40">
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-black/40 border border-gray-800 p-6 rounded-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            Showing <span className="text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-white">{Math.min(currentPage * itemsPerPage, filteredContracts.length)}</span> of <span className="text-white">{filteredContracts.length}</span> archives
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-gray-900 border border-gray-800 rounded-xl text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                  currentPage === i + 1 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                  : 'bg-gray-900 border border-gray-800 text-gray-500 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-gray-900 border border-gray-800 rounded-xl text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* New Agreement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-gray-900 border border-gray-800 w-full max-w-lg rounded-2xl p-8 shadow-2xl"
          >
            <h3 className="text-2xl font-black text-white uppercase italic mb-6">Archive New Agreement</h3>
            <form onSubmit={handleCreateAgreement} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Contract Title</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 text-white focus:border-orange-600 outline-none transition-colors"
                  placeholder="e.g. Master Services Agreement"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Project Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 text-white focus:border-orange-600 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Contract Value (FCFA)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 text-white focus:border-orange-600 outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Contracting Party</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 text-white focus:border-orange-600 outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Signed Date</label>
                  <input 
                    required
                    type="date" 
                    className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 text-white focus:border-orange-600 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Expiration Date</label>
                  <input 
                    required
                    type="date" 
                    className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 text-white focus:border-orange-600 outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gray-800 rounded-xl font-bold uppercase tracking-widest text-xs text-gray-400 hover:bg-gray-800 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-orange-500 transition-all"
                >
                  Register Deed
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
