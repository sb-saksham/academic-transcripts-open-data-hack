import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
export const CenteredButton = ({children}) => {
  return (
    <Row className='text-center my-5' >
      <Col sm="4"></Col>
      <Col sm="4">
        {children}
      </Col>
      <Col sm="4"></Col>
    </Row>
  );
};

export default CenteredButton;