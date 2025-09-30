'use client';

import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import HeaderNav from '@/components/HeaderNav';
import SimplePDFViewer from '@/components/SimplePDFViewer';

export default function DocumentsPage() {
  return (
    <Box minH="100vh" bg="#FBFBFB">
      <HeaderNav signOut={() => {}} />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="lg" mb={2}>
              Legal Documents
            </Heading>
            <Text color="gray.600">
              Browse and view legal documents in the system
            </Text>
          </Box>
          
          <Box
            bg="white"
            borderRadius="lg"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.200"
            p={6}
          >
            <VStack spacing={4} align="stretch">
              <Box>
                <Heading size="md" mb={2}>
                  Laws of the Seven Kingdoms
                </Heading>
                <Text color="gray.600" mb={4}>
                  The complete legal code governing the Seven Kingdoms, including laws on peace, religion, trials, taxes, and more.
                </Text>
              </Box>
              
              <SimplePDFViewer
                src="/laws.pdf"
                title="Laws of the Seven Kingdoms PDF"
                height="600px"
              />
              
              <Box
                bg="blue.50"
                border="1px solid"
                borderColor="blue.200"
                borderRadius="md"
                p={4}
              >
                <Text fontSize="sm" color="blue.700">
                  <strong>Note:</strong> This PDF contains the complete legal code that powers the AI legal query system. 
                  You can ask questions about these laws using the "New Conversation" feature.
                </Text>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
