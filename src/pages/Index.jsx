import React, { useState } from "react";
import { Container, VStack, Text, Button, Input, Table, Thead, Tbody, Tr, Th, Td, IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { FaTrash, FaPlus, FaSun, FaMoon } from "react-icons/fa";
import Papa from "papaparse";
import { CSVLink } from "react-csv";

const Index = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState("edited_data.csv");

  const { colorMode, toggleColorMode } = useColorMode();

  const bg = useColorModeValue("blue.100", "blue.800");
  const tableBg = useColorModeValue("blue.200", "blue.700");
  const buttonBg = useColorModeValue("blue.300", "blue.600");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setHeaders(Object.keys(results.data[0]));
          setData(results.data);
        },
      });
    }
  };

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => {
      acc[header] = "";
      return acc;
    }, {});
    setData([...data, newRow]);
  };

  const handleRemoveRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleInputChange = (index, header, value) => {
    const newData = [...data];
    newData[index][header] = value;
    setData(newData);
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" bg={bg}>
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">CSV Upload and Edit Tool</Text>
        <Button onClick={toggleColorMode} alignSelf="flex-end" bg={buttonBg}>
          {colorMode === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        {data.length > 0 && (
          <>
            <Table variant="simple" bg={tableBg}>
              <Thead>
                <Tr>
                  {headers.map((header) => (
                    <Th key={header}>{header}</Th>
                  ))}
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((row, rowIndex) => (
                  <Tr key={rowIndex}>
                    {headers.map((header) => (
                      <Td key={header}>
                        <Input value={row[header]} onChange={(e) => handleInputChange(rowIndex, header, e.target.value)} />
                      </Td>
                    ))}
                    <Td>
                      <IconButton aria-label="Remove" icon={<FaTrash />} onClick={() => handleRemoveRow(rowIndex)} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Button leftIcon={<FaPlus />} onClick={handleAddRow} bg={buttonBg}>
              Add Row
            </Button>
            <CSVLink data={data} headers={headers} filename={fileName}>
              <Button bg={buttonBg}>Download CSV</Button>
            </CSVLink>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default Index;