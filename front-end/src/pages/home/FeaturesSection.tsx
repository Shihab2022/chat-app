import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { FEATURES_DATA } from '../../config/constants';

export const FeaturesSection: React.FC = () => {
  return (
    <Box component="section" id="features" aria-label="Why Choose Our Chat App" sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#FFFFFF' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 800,
              color: '#1A1A1A',
              mb: 2,
              letterSpacing: '-0.01em',
            }}
          >
            Why Choose Our Chat App
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#6B7280',
              fontSize: '1.125rem',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Built from the ground up for performance, privacy, and rich multimedia collaboration.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {FEATURES_DATA.map((feature) => (
            <Grid item key={feature.id} xs={12} sm={6} md={4}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: '20px',
                  p: 2,
                  backgroundColor: '#F5F7FB',
                  border: '1px solid rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0px 16px 32px rgba(25, 118, 210, 0.08)',
                    border: '1px solid rgba(25, 118, 210, 0.2)',
                    '& .feature-icon': {
                      transform: 'rotate(8deg) scale(1.1)',
                    },
                  },
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
                  <Box
                    className="feature-icon"
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '16px',
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 700, color: '#1A1A1A', mb: 1.5 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};