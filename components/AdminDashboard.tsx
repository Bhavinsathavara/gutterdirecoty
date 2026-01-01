
import React, { useState, useMemo } from 'react';
import { Company } from '../types';
import { FileUpload } from './FileUpload';
import { Trash2, Edit, Search, Save, X, CheckSquare, Square, UploadCloud, Database, AlertCircle, RefreshCw, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

interface AdminDashboardProps {
  companies: Company[];
  onUpload: (csvContent: string) => void;
  onUpdate: (updatedCompany: Company) => void;
  onDelete: (ids: string[]) => void;
  onReset?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ companies, onUpload, onUpdate, onDelete, onReset }) => {
  const [activeTab, setActiveTab] = useState<'manage' | 'import'>('manage');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Company>>({});

  // Filter companies for table
  const filteredCompanies = useMemo(() => {
    if (!searchTerm) return companies;
    const lower = searchTerm.toLowerCase();
    return companies.filter(c => 
      c.name.toLowerCase().includes(lower) || 
      c.city.toLowerCase().includes(lower) ||
      c.state.toLowerCase().includes(lower)
    );
  }, [companies, searchTerm]);

  // Bulk Selection Handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredCompanies.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCompanies.map(c => c.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.size} companies?`)) {
      onDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  // Edit Handlers
  const startEdit = (company: Company) => {
    setEditingId(company.id);
    setEditForm({ ...company });
  };

  const saveEdit = () => {
    if (editingId && editForm.name) {
      // Ensure services is array
      const finalData = { ...editForm } as Company;
      if (typeof finalData.services === 'string') {
          // @ts-ignore
          finalData.services = finalData.services.split(',').map(s => s.trim());
      }
      onUpdate(finalData);
      setEditingId(null);
      setEditForm({});
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('manage')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'manage' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Database size={16} /> Manage Data ({companies.length})
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'import' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <UploadCloud size={16} /> Import / Append CSV
        </button>
      </div>

      {activeTab === 'import' ? (
        <div className="animate-in slide-in-from-right-4">
           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
              <p><strong>Append Mode:</strong> Uploading a new CSV will add to your existing list. Duplicates based on Name+City will be skipped automatically.</p>
           </div>
           <FileUpload onUpload={onUpload} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0 animate-in slide-in-from-left-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-4">
             <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search companies..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
             </div>
             
             <div className="flex gap-2">
                {selectedIds.size > 0 && (
                  <button 
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} /> Delete Selected ({selectedIds.size})
                  </button>
                )}
                
                {onReset && (
                  <button 
                    onClick={onReset}
                    className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                    title="Clear everything"
                  >
                    <RefreshCw size={16} /> Reset DB
                  </button>
                )}
             </div>
          </div>

          {/* Table Container */}
          <div className="border border-slate-200 rounded-lg overflow-hidden flex-1 overflow-y-auto max-h-[60vh]">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-600">
                      {selectedIds.size === filteredCompanies.length && filteredCompanies.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>
                  </th>
                  <th className="px-4 py-3">Company Name</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                      No companies found.
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map(company => (
                    <tr key={company.id} className={`hover:bg-slate-50 group ${editingId === company.id ? 'bg-blue-50' : ''}`}>
                      {editingId === company.id ? (
                        // EDIT MODE ROW
                        <td colSpan={5} className="p-4">
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                               <div className="col-span-1 md:col-span-2 lg:col-span-1">
                                 <label className="block text-xs font-bold text-slate-500 mb-1">Name</label>
                                 <input 
                                   className="w-full border p-2 rounded text-sm" 
                                   value={editForm.name || ''} 
                                   onChange={e => setEditForm({...editForm, name: e.target.value})}
                                 />
                               </div>
                               <div>
                                 <label className="block text-xs font-bold text-slate-500 mb-1">Phone</label>
                                 <input 
                                   className="w-full border p-2 rounded text-sm" 
                                   value={editForm.phone || ''} 
                                   onChange={e => setEditForm({...editForm, phone: e.target.value})}
                                 />
                               </div>
                               <div>
                                 <label className="block text-xs font-bold text-slate-500 mb-1">City</label>
                                 <input 
                                   className="w-full border p-2 rounded text-sm" 
                                   value={editForm.city || ''} 
                                   onChange={e => setEditForm({...editForm, city: e.target.value})}
                                 />
                               </div>
                               <div>
                                 <label className="block text-xs font-bold text-slate-500 mb-1">State</label>
                                 <input 
                                   className="w-full border p-2 rounded text-sm" 
                                   value={editForm.state || ''} 
                                   onChange={e => setEditForm({...editForm, state: e.target.value})}
                                 />
                               </div>
                               <div className="col-span-1 md:col-span-2 lg:col-span-4">
                                 <label className="block text-xs font-bold text-slate-500 mb-1">Social Media URLs</label>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className="flex items-center gap-2">
                                       <Facebook size={14} className="text-slate-400" />
                                       <input className="w-full border p-1 rounded text-xs" placeholder="Facebook" value={editForm.facebookUrl || ''} onChange={e => setEditForm({...editForm, facebookUrl: e.target.value})} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <Instagram size={14} className="text-slate-400" />
                                       <input className="w-full border p-1 rounded text-xs" placeholder="Instagram" value={editForm.instagramUrl || ''} onChange={e => setEditForm({...editForm, instagramUrl: e.target.value})} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <Linkedin size={14} className="text-slate-400" />
                                       <input className="w-full border p-1 rounded text-xs" placeholder="LinkedIn" value={editForm.linkedinUrl || ''} onChange={e => setEditForm({...editForm, linkedinUrl: e.target.value})} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <Twitter size={14} className="text-slate-400" />
                                       <input className="w-full border p-1 rounded text-xs" placeholder="X (Twitter)" value={editForm.twitterUrl || ''} onChange={e => setEditForm({...editForm, twitterUrl: e.target.value})} />
                                    </div>
                                 </div>
                               </div>
                               <div className="col-span-1 md:col-span-2 lg:col-span-4">
                                 <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                                 <textarea 
                                   className="w-full border p-2 rounded text-sm" 
                                   rows={2}
                                   value={editForm.description || ''} 
                                   onChange={e => setEditForm({...editForm, description: e.target.value})}
                                 />
                               </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                              <button onClick={saveEdit} className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded flex items-center gap-1">
                                <Save size={14} /> Save Changes
                              </button>
                            </div>
                          </div>
                        </td>
                      ) : (
                        // DISPLAY MODE ROW
                        <>
                          <td className="px-4 py-3">
                            <button onClick={() => toggleSelect(company.id)} className="text-slate-300 hover:text-blue-600">
                              {selectedIds.has(company.id) ? <CheckSquare size={18} className="text-blue-600" /> : <Square size={18} />}
                            </button>
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-900">{company.name}</td>
                          <td className="px-4 py-3 text-slate-500">{company.city}, {company.state}</td>
                          <td className="px-4 py-3 text-slate-500">{company.phone}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => startEdit(company)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" 
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => onDelete([company.id])}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded" 
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-xs text-slate-400 text-right">
            Showing {filteredCompanies.length} of {companies.length} records
          </div>
        </div>
      )}
    </div>
  );
};
