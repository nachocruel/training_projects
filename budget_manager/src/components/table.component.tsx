import { useState } from "react";
import { type BudgetData } from "../models/budget.data";
import BudgetFormComponent from "./budget.form.component";
import './table.component.css';

type props = {
    data: BudgetData[],
    onAddItem: (item: BudgetData) => void,
    removeItem: (index: BudgetData) => void,
};

const TableComponent = ({ data, onAddItem, removeItem }: props) => {

    const [showForm, setShowForm] = useState(false);

    const handleAddRow = () => {
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    return (
        <div className="table-container">
            <table className="budget-table">
                <thead className="table_header">
                    <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>#</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td className="table_row" style={{ color: 'black' }}>{item.category}</td>
                            <td className="table_row" style={{ color: 'black' }}>${item.amount}</td>
                            <td className="table_row" style={{ color: 'black' }}><button className="btn-remove" onClick={() => removeItem(item)}>Remove</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleAddRow} style={{ margin: '10px' }} className="btn-add">Add New Row</button>
            {showForm && <BudgetFormComponent onClose={handleCloseForm} addBudgetItem={(item) => onAddItem(item)} />}
        </div>
    )
}

export default TableComponent;