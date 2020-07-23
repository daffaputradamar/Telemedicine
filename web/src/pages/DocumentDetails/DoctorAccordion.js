import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Box,
  Grid,
  Button,
  makeStyles,
} from "@material-ui/core";
import { ExpandMore, PersonOutline } from "@material-ui/icons";
import { timeConverter } from "../../lib/timeConverter";

const useStyles = makeStyles((theme) => ({
  linkStyle: {
    textDecoration: "none",
    color: "#000",
  },
}));

function DoctorAccordion({ doctors }) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const classes = useStyles();

  return (
    <div>
      {doctors.map((doctor) => {
        return (
          <Accordion
            key={doctor.uid}
            expanded={expanded === doctor.uid}
            onChange={handleChange(doctor.uid)}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls={`${doctor.uid}bh-content`}
              id={`${doctor.uid}bh-header`}
            >
              <Grid container alignItems="center" justify="space-between">
                <div>
                  <Box display="flex" alignItems="center">
                    <Box mr={2}>
                      <PersonOutline fontSize="large" />
                    </Box>
                    <div>
                      <Typography>{doctor.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {doctor.reply.isReplied
                          ? `${timeConverter(doctor.reply.timestamp)}`
                          : "(Belum ada Tanggapan)"}
                      </Typography>
                    </div>
                  </Box>
                </div>
                <Link to={`/u/${doctor.uid}`} className={classes.linkStyle}>
                  <Button color="primary">See Profile</Button>
                </Link>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              {doctor.reply.isReplied ? (
                <Typography display="block">{doctor.reply.reply}</Typography>
              ) : (
                <Typography align="center">Belum ada tanggapan</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}

export default DoctorAccordion;
