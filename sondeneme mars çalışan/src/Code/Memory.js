import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

const Memory = ({ dataMemory, instructionMemory }) => {
  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      textAlign: "center",
      border: "1px solid #ddd",
      padding: "8px",
      position: "sticky",
      top: 0,
    },
    body: {
      fontSize: 14,
      textAlign: "center",
      border: "1px solid #ddd",
      padding: "8px",
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      "&:nth-of-type(even)": {
        backgroundColor: "#f2f2f2",
      },
    },
  }))(TableRow);

  const clearMemory = () => {
    dispatch({
      type: 'CLEAR_MEMORY',
    });
  };

  return (
    <div style={{ margin: "20px", width: "50%" }}>
      <h2 style={{ textAlign: "center" }}>Data Memory</h2>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="data-memory-table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Address</StyledTableCell>
              <StyledTableCell>Value</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataMemory.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {index}
                </StyledTableCell>
                <StyledTableCell align="center">{row}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <h2 style={{ textAlign: "center", marginTop: "20px" }}>
        Instruction Memory
      </h2>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="instruction-memory-table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Address</StyledTableCell>
              <StyledTableCell>Instruction</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instructionMemory.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {index}
                </StyledTableCell>
                <StyledTableCell align="center">{row}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Button variant="contained" color="secondary" onClick={clearMemory}>
          Clear Memory
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    dataMemory: state.dataMemory,
    instructionMemory: state.instructionMemory,
  };
};

export default connect(mapStateToProps)(Memory);
