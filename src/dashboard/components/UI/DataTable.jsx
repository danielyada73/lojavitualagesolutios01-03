export default function DataTable({ columns=[], rows=[] }){
  return (
    <div className="panel">
      <table className="table">
        <thead>
          <tr>{columns.map(c=><th key={c.key}>{c.header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}>
              {columns.map(c=><td key={c.key}>{c.render ? c.render(r) : r[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
