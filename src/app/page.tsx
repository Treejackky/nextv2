'use client';

import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [filteredData, setFilteredData] = useState<any[]>([]);
 
  // Get data
  useEffect(() => {
    getItem().then((res) => setData(res.data));
  }, []);

  // Filter data
  useEffect(() => {
    if (filter) {
      const filterData = data.filter((item: any) => item.GrpSub === filter);
      setFilteredData(filterData);
    } else {
      setFilteredData(data);
    }
  }, [data, filter]);

  const uniqueGrpSubs = Array.from(new Set(data.map(item => item.GrpSub)));

  // Scroll to position
  const scrollToPosition = (grpSub: any) => {
    const element = document.getElementById(grpSub);
    if (element) {
      const pos = element.getBoundingClientRect();
      window.scrollTo({
        top: pos.top + window.scrollY,
        behavior: 'smooth'
      });
    }
  }


  return (
    <>
      <header>
        <nav>
          {uniqueGrpSubs.map((grpSub: string) => (
            <button key={grpSub} onClick={() => scrollToPosition(grpSub)}>
              {grpSub}
            </button>
          ))}
        </nav>
      </header>
    <div className="main-content">
    {filteredData.map((item: any) => (
        <div id={item.GrpSub} key={item.id}>
          <h1>{item.GrpSub}</h1>
          <h1>{item.Name}</h1>
        </div>
      ))}
    </div>

    </>
  );
}

export async function getItem() {
  const res = await fetch('http://54.179.86.5:8765/v1/item');
  const data = await res.json();
  return { data };
}

