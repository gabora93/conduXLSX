import React from 'react';
const SuccessStyle = {
    margin: '40px',
    border: '5px solid green'
  };


const BestGrade = (props) => (



    <div style={SuccessStyle}>
        <h1>Cuadro de Honor:</h1>
        <h2>Nombre: {props.name} {props.lastName}</h2>
        <h3>Calificacion: {props.grade}</h3>
    </div>




)


export default BestGrade;