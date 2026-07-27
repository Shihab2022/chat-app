import React from 'react';
import { Box, Container, Typography,  Grid, Card, CardContent, Avatar, Rating } from '@mui/material';
import { TESTIMONIALS_DATA } from '../../config/constants';

export const Testimonials: React.FC = () => {
  return (
    <Box component="section" aria-label="User Testimonials" sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#F5F7FB' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 800,
              color: '#1A1A1A',
              mb: 2,
            }}
          >
            Loved by Teams Worldwide
          </Typography>
          <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '1.125rem' }}>
            See how our messenger elevates daily workflows and personal connection.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {TESTIMONIALS_DATA.map((item) => (
            <Grid key={item.id} item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: '20px',
                  p: 3,
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.03)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                  },
                }}
              >
                <CardContent sx={{ p: 0, mb: 3 }}>
                  <Rating value={item.rating} readOnly precision={0.5} sx={{ mb: 2, color: '#FFB300' }} />
                  <Typography variant="body1" sx={{ color: '#1A1A1A', fontStyle: 'italic', lineHeight: 1.6 }}>
                    "{item.content}"
                  </Typography>
                </CardContent>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar alt={item.name} src={item.avatarUrl} sx={{ width: 48, height: 48 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1A1A1A' }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6B7280', display: 'block' }}>
                      {item.role} • {item.company}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};