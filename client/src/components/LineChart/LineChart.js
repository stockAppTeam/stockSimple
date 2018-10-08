import React from 'react';
import "./LineChart.css"
import { Card, CardBody, CardImage, CardText, Fa } from 'mdbreact';
import { Line } from 'react-chartjs-2';

const LineChart = props => (
    <Line data={props} />
)

export default LineChart