import { Box, Button, chakra, Flex, Grid, GridItem, Link, SimpleGrid, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import privateUserRoute from '../routers/privateUserRoute';
import { Formik } from "formik";
import { toast } from 'react-toastify';
import FileInput from '../components/FileInput';
import NextLink from 'next/link';
import { uploadFile } from '../action/uploadFile';
import ButtonWithModal from '../components/ButtonWithModal';
import { getEntries, submitEntries } from '../action/entries';
import ContentLoader from '../components/ContentLoader';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import SelectField from '../components/SelectField';
import FormField from '../components/FormField';

const options = [
  { value: "ppt", label: "ppt" },
  { value: "link", label: "link" },
]
const Inowave = () => {
  const textColor = useColorModeValue("gray.700", "gray.50");
  const [submission, setSubmission] = useState()
  const [loading, setLoading] = useState(true);
  const handleSubmit = async (values) => {
   
    if(values?.type==="")
      {
        toast.error('Please Select a option')
        return;
      }
    if(values.type==="ppt")
    {
        if (!values?.ppt?.name) {
          toast.error('Please Select a file')
          return;
        }
        if (values?.ppt?.size > 5000000) {
          toast.error('File Size Exceeded');
          return;
        }

        try {
          setLoading(true);
          const data = await uploadFile(values.ppt)
          console.log(data);
          if (data?.error) {
            toast.error('Someting Went Wrong')
            setLoading(false);
            return
          }
          const entryData = await submitEntries({
            submission:data.submission
          }, 'innowave');
    
          if (entryData?.error) {
            toast.error(entryData?.error);
            setLoading(false);
            return;
          }
          setSubmission(entryData.submission);
          toast.success('Entry Submitted Successfully');
        } catch (e) {
          console.log(e)
          toast.error('Someting Went Wrong')
        }
        setLoading(false);
      }
    else if(values.type==="link")
    {
      if(values?.url==='')
        {
          toast.error('Please enter link')
          return;
        }
        try {
          const entryData = await submitEntries({
            submission:values.url
          }, 'innowave2');
    
          if (entryData?.error) {
            toast.error(entryData?.error);
            setLoading(false);
            return;
          }
          setSubmission(entryData.submission);
          toast.success('Entry Submitted Successfully');
        } catch (e) {
          console.log(e)
          toast.error('Someting Went Wrong')
        }
        setLoading(false);
      }
    }
   
    
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const entryData = await getEntries('innowave');
        if (entryData?.error) {
          console.log(entryData?.error);
        }
        setSubmission(entryData?.submission);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
    fetchSubmission();
  }, [setSubmission])
  const [tabIndex, setTabIndex] = useState(0)
  return !loading ? (
    <Layout>
      <Box
        pt={10}
        width={"full"}
        pb={"20px"}
        px={{
          base: '16px',
          md: '48px',
          lg: '64px'
        }}
      >
        <NextLink href='/dashboard'>
          <chakra.h3
            fontWeight={"bold"}
            fontSize={20}
            textTransform={"uppercase"}
            color={"#5FAB63"}
            cursor="pointer"
            display={'flex'}
            alignItems={'center'}
          >
            <ChevronLeftIcon w={6} h={6}/> <span>Back to all events</span>
          </chakra.h3>
        </NextLink>
        <chakra.h1
          py={5}
          fontSize={48}
          fontWeight={"bold"}
          color={textColor}
        >
          Inowave
        </chakra.h1>
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          gap={10}
        >
          <GridItem
          >
            <Tabs onChange={(index) => setTabIndex(index)}>
              <TabList>
                <Tab>
                  Topics
                </Tab>
                <Tab>Instructions</Tab>
              </TabList>
              <TabPanels bg={"rgba(165, 151, 39, 0.7)"}>
                <TabPanel>
                  <Stack spacing={3}>
                    <Text fontSize='3xl'>
                      Topics
                    </Text>
                    <Text fontSize='xl'>
                      - Application for an NGO to display its work + accept donations
                    </Text>
                    <Text fontSize='xl'>
                      - Travelogue Application
                    </Text>
                    <Text fontSize='xl'>
                      - Application for Health and Fitness
                    </Text>
                    <Text fontSize='xl'>
                      - Website/App for selling sports goods
                    </Text>
                    <Text fontSize='xl'>
                      - Smart hiring platform for recruiters
                    </Text>
                  </Stack>
                </TabPanel>
                <TabPanel>
                  <Stack spacing={3}>
                    <Text fontSize='3xl'>
                      Instructions
                    </Text>
                    <Text fontSize='xl'>
                      1. Topics are out, the idea submission deadline is 18th April 2021 (11:59 pm)
                    </Text>
                    <Text fontSize='xl'>
                      2. Participants will have to choose only a topic (listed above in &lsquo;Rounds&lsquo;) and make a presentation on their idea.
                    </Text>
                    <Text fontSize='xl'>
                      3. Include a maximum of 6 slides in the PPT.
                    </Text>
                    <Text fontSize='xl'>
                      4. Shortlisted participants from round 1 will enter round 2, where you will have to make a website or an app based on the idea you submitted.
                    </Text>
                    <Text fontSize='xl'>
                      5. Participants should rename their entry as FirstName_LastName.extension
                    </Text>
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>
          {
            submission?.id ?
              (
                <GridItem>
                  <Flex
                    minH={"200px"}
                    border={'2px solid primaries.100'}
                    alignItems={"center"}
                    justifyContent={"center"}
                    flexDirection={'column'}
                    gap={5}
                  >
                    <Text fontSize={'2xl'} textAlign={"center"}>You have already submitted your entry</Text>
                    <Link
                      href={submission.ppt}
                      bg={"blue.400"}
                      px={4}
                      py={2}
                      color={"white"}
                      _hover={{
                        bg: "blue.500",
                      }}
                      borderRadius={'md'}
                    >
                      Downlooad ppt
                    </Link>
                    
                  </Flex>
                </GridItem>
              ) : (
                <GridItem>
                  <Formik
                    initialValues={{ ppt: {},url:"",type:""}}
                    onSubmit={handleSubmit}
                  >
                    {({ handleBlur, handleChange, values, handleSubmit }) => (
                      <form onSubmit={handleSubmit}>
                        <Stack
                          spacing={8}
                        >
                          <SelectField
                            name='type'
                            value={values.type}
                            label='Paper Type'
                            placeholder={'Please Select an Option'}
                            options={options}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                      
                          {
                            values.type === 'ppt' && <FileInput
                              accept={'.ppt,.pptx'}
                              label='Upload Your PPT ( .ppt, .pptx upto 5mb )'
                              name='ppt'
                              onBlur={handleBlur}
                            />
                          }
                          {
                            values.type==='link' &&   <FormField
                            label="url"
                            type='text'
                            name="url"
                            value={values.url}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="url"
                            bg={"rgba(165, 151, 39, 0.7)"}
            
                          />
                          }
                          <ButtonWithModal
                            handleSubmit={() => handleSubmit(values)}
                          />
                        </Stack>
                      </form>
                    )}
                  </Formik>
                </GridItem>
              )
          }
        </SimpleGrid>
      </Box>
    </Layout>
  ) : (
    <ContentLoader />
  )
}

export default privateUserRoute(Inowave)