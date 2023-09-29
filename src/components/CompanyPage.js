import Table from 'react-bootstrap/Table';

const getAccessRequested = async () => {
    
}
const TranscriptsRequested = async () => {
  const accessRequested = await getAccessRequested();  
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Document Of Person</th>
          <th>Document Name</th>
          <th>Access Granted</th>
        </tr>
      </thead>
      <tbody>
        {accessRequested.map((_, el) => {
            return (
                <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>      
            );    
        })}      
      </tbody>
    </Table>
  );
}

export default TranscriptsRequested;