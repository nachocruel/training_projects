import './App.css'
import TableComponent from './components/table.component'
import ChartComponent from './components/chart.component'
import { type BudgetData } from './models/budget.data'
import { useEffect, useState } from 'react';

function App() {
  const [budgetData, setBudgetData] = useState<BudgetData[]>([]);

  const loadBudgetData = () => {
    const data: BudgetData[] = [
      { category: 'Food', amount: 200 },
      { category: 'Rent', amount: 800 },
      { category: 'Entertainment', amount: 150 },
    ];
    setBudgetData(data);
  }

  const addBudgetItem = (item: BudgetData) => {
    setBudgetData(prevData => [...prevData, item]);
  }

  const removeBudgetItem = (item: BudgetData) => {
    setBudgetData(prevData => prevData.filter(i => i !== item));
  }

  useEffect(() => {
    loadBudgetData();
  }, []);

  return (
    <>
      <div className='flex-item'>
        <h1>Budget Tracker</h1>
        <ChartComponent data={budgetData} />
      </div>
      <div className='flex-item'>
        <TableComponent data={budgetData} onAddItem={addBudgetItem} removeItem={removeBudgetItem} />
      </div>
    </>
  )
}

export default App
