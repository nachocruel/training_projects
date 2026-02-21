import React from 'react';
import ReactDom from 'react-dom';
import { type BudgetData } from '../models/budget.data';
import './budget.form.component.css';

type props = {
    onClose: () => void;
    addBudgetItem: (item: BudgetData) => void;
};


const BudgetFormComponent = ({ onClose, addBudgetItem }: props) => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const category = formData.get('category') as string;
        const amount = parseFloat(formData.get('amount') as string);
        addBudgetItem({ category, amount });
        onClose();
    }
    return ReactDom.createPortal(
        <div className='budget-form'>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <h2>Add Budget Item</h2>
                <span className='close-button' onClick={onClose}>X</span>
            </div>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="category">Category:</label>
                    <input type="text" id="category" name="category" />
                </div>
                <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="amount">Amount:</label>
                    <input type="number" id="amount" name="amount" />
                </div>
                <button type="submit">Add</button>
            </form>
        </div>,
        document.getElementById('modal-root')!
    );
}

export default BudgetFormComponent;