import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Box,
} from "@material-ui/core";
import { ExpandMore, PersonOutline } from "@material-ui/icons";
import { timeConverter } from "../../lib/timeConverter";

function DoctorAccordion({ doctors }) {
  const [expanded, setExpanded] = useState(false);
  const [updateDoctor, setUpdateDoctor] = useState(doctors);

  useEffect(() => {
    setUpdateDoctor(doctors);
  }, [doctors]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      {updateDoctor.map((doctor) => {
        return (
          <Accordion
            key={doctor.ids}
            expanded={expanded === doctor.ids}
            onChange={handleChange(doctor.ids)}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls={`${doctor.ids}bh-content`}
              id={`${doctor.ids}bh-header`}
            >
              <Box display="flex" alignItems="center">
                <Box mr={2}>
                  <PersonOutline fontSize="large" />
                </Box>
                <div>
                  <Typography>{doctor.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {doctor.reply === ""
                      ? "(Belum ada Tanggapan)"
                      : `${timeConverter(doctor.timestamp)}`}
                  </Typography>
                </div>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {doctor.reply === "" ? (
                <Typography align="center">Belum ada tanggapan</Typography>
              ) : (
                doctor.reply
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}

export default DoctorAccordion;
