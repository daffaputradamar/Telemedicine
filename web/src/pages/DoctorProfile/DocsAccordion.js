import React, { useState } from "react";
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
import { ExpandMore, Description } from "@material-ui/icons";
import { timeConverter } from "../../lib/timeConverter";

const useStyles = makeStyles((theme) => ({
  linkStyle: {
    textDecoration: "none",
    color: "#000",
  },
}));

function DocsAccordion({ docs }) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const classes = useStyles();

  return (
    <div>
      {docs.length !== 0 ? (
        docs.map((doc) => {
          return (
            <Accordion
              key={doc.docid}
              expanded={expanded === doc.docid}
              onChange={handleChange(doc.docid)}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`${doc.docid}bh-content`}
                id={`${doc.docid}bh-header`}
              >
                <Grid container alignItems="center" justify="space-between">
                  <div>
                    <Box display="flex" alignItems="center">
                      <Box mr={2}>
                        <Description fontSize="large" color="error" />
                      </Box>
                      <div>
                        <Typography>{doc.filename}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {doc.reply.isReplied
                            ? `${timeConverter(doc.reply.timestamp)}`
                            : "(Belum ada Tanggapan)"}
                        </Typography>
                      </div>
                    </Box>
                  </div>
                  <Link to={`/docs/${doc.docid}`} className={classes.linkStyle}>
                    <Button color="primary">Lihat Dokumen</Button>
                  </Link>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                {doc.reply.isReplied ? (
                  <Typography display="block">{doc.reply.reply}</Typography>
                ) : (
                  <Typography align="center">Belum ada tanggapan</Typography>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })
      ) : (
        <Box mt={4}>
          <Typography color="textSecondary" align="center">
            Dokumen tidak ada
          </Typography>
        </Box>
      )}
    </div>
  );
}

export default DocsAccordion;
