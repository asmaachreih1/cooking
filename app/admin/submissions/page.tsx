"use client";

import { useEffect, useState } from 'react';
import {
    MessageSquare, Eye, Trash2, CheckCircle, Search, Filter, Mail, Phone, Calendar, Loader2
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { UserSubmission } from '@/types';

export default function SubmissionsManagement() {
    const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const subs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Convert timestamp to string
                createdAt: doc.data().createdAt?.toDate()?.toLocaleString() || 'Just now'
            } as any)) as UserSubmission[];
            setSubmissions(subs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this submission?')) {
            try {
                await deleteDoc(doc(db, 'submissions', id));
            } catch (error) {
                console.error("Error deleting submission:", error);
            }
        }
    };

    const handleUpdateStatus = async (id: string, currentStatus: string) => {
        const nextStatus = currentStatus === 'new' ? 'pending' : currentStatus === 'pending' ? 'replied' : 'new';
        try {
            await updateDoc(doc(db, 'submissions', id), { status: nextStatus });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };
    const filteredSubmissions = submissions.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-bold" />
                    <input
                        type="text"
                        placeholder="Search submissions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-olive-green/20 focus:border-olive-green transition-all outline-none font-medium text-sm shadow-soft"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 transition-all font-bold text-sm text-dark-brown shadow-soft active:scale-95">
                    <Filter className="w-4 h-4" />
                    <span>Filter by Status</span>
                </button>
            </div>

            <div className="bg-white rounded-[32px] shadow-soft border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">User</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subject</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Preview</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-8 h-8 text-olive-green animate-spin" />
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading messages...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredSubmissions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No messages found</p>
                                    </td>
                                </tr>
                            ) : filteredSubmissions.map((sub) => (
                                <tr key={sub.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-olive-green/10 rounded-full flex items-center justify-center text-olive-green font-bold text-xs shadow-inner">
                                                {sub.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-bold text-dark-brown text-sm mb-0.5">{sub.name}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium lowercase">
                                                    <Mail className="w-2.5 h-2.5" /> {sub.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-[10px] px-3 py-1 rounded-full font-bold bg-gray-100 text-gray-600 uppercase tracking-tighter">
                                            {sub.subject.replace('-', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-gray-500 text-xs font-medium italic line-clamp-1 max-w-xs group-hover:line-clamp-none transition-all">"{sub.message}"</p>
                                        <div className="flex items-center gap-2 mt-1 text-[9px] text-gray-300 font-bold uppercase tracking-widest">
                                            <Calendar className="w-2.5 h-2.5" /> {(sub as any).createdAt}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter ${sub.status === 'new' ? 'bg-olive-green text-white shadow-sm' :
                                                sub.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-gray-100 text-gray-400'
                                            }`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button 
                                                onClick={() => handleUpdateStatus(sub.id, sub.status)}
                                                className="p-2.5 bg-white shadow-soft rounded-xl text-olive-green hover:bg-olive-green hover:text-white transition-all"
                                                title="Cycle status"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(sub.id)}
                                                className="p-2.5 bg-red-50 rounded-xl text-gray-400 hover:text-deep-red transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
