import React from 'react';
import DataInput from './DataInput';
import DragDropFile from './DragDropFile';
import XLSX from 'xlsx';
import Chart from "react-google-charts";
import Papa from 'papaparse'
import MinimumGrade from './components/MinimumGrade/MinimumGrade';
import BestGrade from './components/BestGrade/BestGrade';


class SheetJSApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [], /* Array of Arrays e.g. [["a","b"],[1,2]] */
            cols: [],  /* Array of column objects e.g. { name: "C", K: 2 } */
            csvfile: undefined,
            dataFromCSV: [],
            isFileLoaded: false,
            globalGrades: null,
            studentsFirstGrade: [],
            averageFirstGrade: 0,
            studentsSecondGrade: [],
            averageSecondGrade: 0,
            studentsThirdGrade: [],
            averageThirdGrade: 0,
            studentBestGrade: null,
            studentWorstGrade: null,
            isDataLoaded: false
        };
        this.handleFile = this.handleFile.bind(this);

    };


    handleFile(file) {
        /* Boilerplate to set up FileReader */
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            console.log(ws)
            const csv = XLSX.utils.sheet_to_csv(ws)
            console.log(csv)
            Papa.parse(csv, {
                complete: this.updateData,
                header: true,
                skipEmptyLines: true
            });

        };
        if (rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
    };

    updateData = (result) => {
        console.log(result);
        console.log(result.data)
        this.setState({ csvfile: result.data })

        var data = result.data;

        var firstGrade = data.filter(student => {
            return student.Grado === "1"
        })

        var secondGrade = data.filter(student => {
            return student.Grado === "2"
        })

        var thirdGrade = data.filter(student => {
            return student.Grado === "3"
        })

        this.setState({
            dataFromCSV: data,
            studentsFirstGrade: firstGrade,
            studentsSecondGrade: secondGrade,
            studentsThirdGrade: thirdGrade,
            isDataLoaded: true
        })
        this.setGrupos()
        this.getWorstAndBestGrades()





    }
    //stores the scores of the students by his school grade
    setGrupos() {
        const { studentsFirstGrade, studentsSecondGrade, studentsThirdGrade } = this.state
        const gradesFirstGrade = []
        const gradesSecondGrade = []
        const gradesThirdGrade = []
        var GlobalGrades = []

        studentsFirstGrade.forEach(alumno => {
            gradesFirstGrade.push(parseFloat(alumno.Calificacion))
        });

        studentsSecondGrade.forEach(alumno => {
            gradesSecondGrade.push(parseFloat(alumno.Calificacion))
        });

        studentsThirdGrade.forEach(alumno => {
            gradesThirdGrade.push(parseFloat(alumno.Calificacion))
        });

        studentsFirstGrade.forEach(alumno => {
            GlobalGrades.push(parseFloat(alumno.Calificacion))
        })

        studentsSecondGrade.forEach(alumno => {
            GlobalGrades.push(parseFloat(alumno.Calificacion))
        })

        studentsThirdGrade.forEach(alumno => {
            GlobalGrades.push(parseFloat(alumno.Calificacion))
        })

        var average = this.addAndGetAverage(GlobalGrades)
        this.setState({ globalGrades: average.toFixed(2) })

        var sumaPrimerGrado = this.addAndGetAverage(gradesFirstGrade)
        var sumaSegundoGrado = this.addAndGetAverage(gradesSecondGrade)
        var sumaTercerGrado = this.addAndGetAverage(gradesThirdGrade)

        this.setState({
            averageFirstGrade: sumaPrimerGrado,
            averageSecondGrade: sumaSegundoGrado,
            averageThirdGrade: sumaTercerGrado
        })
        console.log(this.state)
    }

    getWorstAndBestGrades() {
        //getting the highest score of the students
        const maxValueOfY = Math.max(...this.state.dataFromCSV.map(o => o.Calificacion), 0);
        console.log(maxValueOfY)
        var CuadroDeHonor = this.state.dataFromCSV.filter(alumno => {
            return alumno.Calificacion == maxValueOfY
        })
        //getting the lowest score of the students
        const minValueOfStudents = Math.min(...this.state.dataFromCSV.map(o => o.Calificacion));

        var CuadroDeHorror = this.state.dataFromCSV.filter(alumno => {
            return alumno.Calificacion == minValueOfStudents
        })
        console.log(CuadroDeHonor)

        this.setState({
            studentBestGrade: CuadroDeHonor,
            studentWorstGrade: CuadroDeHorror
        })
    }
    //make a sum of the scores and get the average.
    addAndGetAverage(calif) {
        var suma = calif.reduce(function (sum, value) {
            return sum + value;
        }, 0);
        return suma / calif.length
    }

    //Function to add random color to the bars in the bar chart
    getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 12)];
        }
        return color;
    }
    render() {
        var worstGrade;
        var bestGrade;
        var Promedio;
        var displayCharts;

        const dataForPieChart = [
            ["Grado", "Calificacion Promedio"],
            ["Primer Grado", this.state.averageFirstGrade],
            ["Segundo Grado", this.state.averageSecondGrade],
            ["Tercer Grado", this.state.averageThirdGrade]
        ];

        const dataForBarChart = [["Alumno", "Calificacion", { role: "style" }],]
        const options = {
            title: "Promedio por grado escolar",
            pieHole: 0.4,
            is3D: true
        };
        const { dataFromCSV } = this.state

        dataFromCSV.forEach(alumno => {
            var color = this.getRandomColor()
            var info = [alumno.Nombres, parseFloat(alumno.Calificacion), color]
            dataForBarChart.push(info)
        });

        if (this.state.isDataLoaded) {
            displayCharts = (
                <div>
                    <Chart
                        chartType="ColumnChart"
                        width="100%"
                        height="400px"
                        data={dataForBarChart}
                    />

                    <Chart
                        chartType="PieChart"
                        width="100%"
                        height="400px"
                        data={dataForPieChart}
                        options={options}
                    />
                </div>)
        } else {
            displayCharts = (
                <div>

                </div>)
        }

        if (this.state.globalGrades) {
            Promedio = <h1>Promedio Grupal {this.state.globalGrades}</h1>
        } else {
            Promedio = <h1>Drag and Drop a XLSX file to show the info about the students scores</h1>
        }

        if (this.state.studentWorstGrade) {
            worstGrade = <MinimumGrade
                name={this.state.studentWorstGrade[0].Nombres}
                lastName={this.state.studentWorstGrade[0]["Apellido Paterno"]}
                grade={this.state.studentWorstGrade[0].Calificacion} />
            bestGrade = <BestGrade
                name={this.state.studentBestGrade[0].Nombres}
                lastName={this.state.studentBestGrade[0]["Apellido Paterno"]}
                grade={this.state.studentBestGrade[0].Calificacion} />


        } else {
            worstGrade = <p>its up to you</p>
            bestGrade = <p> or You can manually upload a file </p>
        }

        return (
            <div className="App">
                <h2>Import XLSX File!</h2>

                <DragDropFile handleFile={this.handleFile}>
                    <div className="row">
                        <div className="col-xs-12">
                            <DataInput handleFile={this.handleFile} />
                        </div>
                    </div>
                </DragDropFile>
                <p />

                <div>
                    {Promedio}
                    {bestGrade}
                    {worstGrade}
                </div>
                {displayCharts}
            </div>
        );
    };
};

export default SheetJSApp;