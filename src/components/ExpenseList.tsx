import React from 'react';
import type { Expense } from '../types';

interface ExpenseListProps {
    expenses: Expense[];
    onEdit: (expense: Expense) => void;
    onDelete: (id: number) => void;
    onAdd: () => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onEdit, onDelete, onAdd }) => {
    
    // Helper to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    // Helper to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="card">
            <div className="header">
                <h2>My Expenses</h2>
                <button className="btn-primary" onClick={onAdd}>+ Add Expense</button>
            </div>
            
            {expenses.length === 0 ? (
                <div className="empty-state">
                    <p>No expenses found. Add one to get started!</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id}>
                                    <td>{formatDate(expense.expense_date)}</td>
                                    <td>{expense.title}</td>
                                    <td>{expense.category || '-'}</td>
                                    <td style={{ fontWeight: 500 }}>{formatCurrency(expense.amount)}</td>
                                    <td>
                                        <div className="actions">
                                            <button 
                                                className="btn-secondary" 
                                                onClick={() => onEdit(expense)}
                                                style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="btn-danger" 
                                                onClick={() => {
                                                    if(window.confirm('Are you sure you want to delete this expense?')) {
                                                        onDelete(expense.id);
                                                    }
                                                }}
                                                style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ExpenseList;
