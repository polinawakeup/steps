import { useState } from 'react'
import './App.css'

interface Entry {
  date: string;
  distance: string;
}

function App(): React.ReactElement {

  const [date, setDate] = useState('');
  const [distance, setDistance] = useState('');
  const [data, setData] = useState<Entry[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState('');

  function handleDateChange ( {target}: React.ChangeEvent<HTMLInputElement> ): void {
    setDate(target.value);
  }

  function handleDistanceChange ( {target}: React.ChangeEvent<HTMLInputElement> ): void {
    setDistance(target.value);
  }
  
  function handleSubmit (e: React.ChangeEvent<HTMLFormElement>): void {
    e.preventDefault();

    if (date === '' || distance === '') {
      console.log('Пустое поле');
      return
    }
    
    const newEntry: Entry = {
      date,
      distance
    }

    if(editMode) {
      setData(prevData =>
        prevData.map(entry =>
          entry.date === editId
          ? { date, distance }
          : entry
        )
      );
      setEditId('');
      setEditMode(false);
    } else {
      setData((prevData) => {
      const index = (prevData.findIndex(entry => entry.date === newEntry.date));

      if (index !== -1) {
        return prevData.map((entry, i) =>
          i === index
          ? {
              ...entry,
              distance: (
                parseInt(newEntry.distance) + parseInt(prevData[index].distance)
              ).toString()
            }
          : entry
        )
      }
        
      return [...prevData, newEntry];
      });
    }

    setDate('');
    setDistance('');
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}.${month}.${year}`
  }

  function handleDelete(dateId: string): void {
    setData(prevData => prevData.filter(entry => entry.date !== dateId));
  }

  function handleEdit(dateId: string): void {
    const targetEntry = data.find(entry => entry.date === dateId);
    if (targetEntry) {
      setDate(targetEntry.date);
      setDistance(targetEntry.distance);
      setEditMode(true);
      setEditId(targetEntry.date);
    }
  }

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <div className='input_wrapper'>
          <label htmlFor="date">Дата (ДД.ММ.ГГ)</label>
          <input
            type="date"
            id='date' name='date'
            value={date}
            onChange={handleDateChange} />
        </div>
        <div className='input_wrapper'>
          <label htmlFor="distance">Пройдено км</label>
          <input
            type="number"
            id='distance' name='distance'
            value={distance}
            onChange={handleDistanceChange} />
        </div>
        <button type='submit'>
          {!editMode ? "ОК" : "Сохранить"}
        </button>
      </form>
      <div className='tableRow'>
        <div className='row header'>
          <span className='cell'>Дата (ДД.ММ.ГГ)</span>
          <span className='cell'>Пройдено км</span>
          <span className='cell'>Действия</span>
        </div>
        {data.length !== 0
          ? (data.slice().sort((a, b) => 
              new Date(b.date).getTime() - new Date(a.date).getTime())
            ).map(entry => {
              return (
                <div className='row' key={entry.date}>
                  <span className='cell'>
                    {formatDate(entry.date)}
                  </span>
                  <span className='cell'>{entry.distance}</span>
                  <div className='cell controls'>
                    <button
                      className='icon'
                      onClick={() => handleDelete(entry.date)}
                    >delete</button>
                    <button
                      className='icon'
                      onClick={() => handleEdit(entry.date)}
                    >edit</button>
                  </div>
                </div>
              )
            })
          : null
        }
      </div>
    </div>
  )
}

export default App
