'use client';

import { Box, Button, Text, VStack, HStack, Icon, Link } from '@chakra-ui/react';
import { FiDownload, FiExternalLink } from 'react-icons/fi';

interface SimplePDFViewerProps {
  src: string;
  title: string;
  height?: string;
}

export default function SimplePDFViewer({ src, title, height = "600px" }: SimplePDFViewerProps) {

  return (
    <VStack spacing={4} align="stretch">
      <HStack spacing={2} justify="center" wrap="wrap">
        <Button 
          colorScheme="blue" 
          size="sm"
          leftIcon={<Icon as={FiExternalLink} />}
        >
            <Link href={src} target='_blank'> 
            Open in New Tab
            </Link>         
        </Button>
      </HStack>

      {/* PDF Display */}
      <Box
        border="1px solid"
        borderColor="gray.300"
        borderRadius="md"
        overflow="hidden"
        bg="white"
        minHeight={height}
      >
        <Box
          as="iframe"
          src={`${src}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
          width="100%"
          height={height}
          title={title}
          style={{
            border: 'none',
            display: 'block'
          }}
        />
      </Box>

      {/* Fallback message */}
      <Box
        bg="blue.50"
        border="1px solid"
        borderColor="blue.200"
        borderRadius="md"
        p={3}
      >
        <Text fontSize="sm" color="blue.700" textAlign="center">
          <strong>Having trouble viewing the PDF?</strong> Try opening it in a new tab or downloading it directly.
        </Text>
      </Box>
    </VStack>
  );
}
