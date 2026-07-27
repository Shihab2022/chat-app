import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { STATS_DATA } from '../../config/constants';

export const StatsSection: React.FC = () => {
  return (
    <Box component="section" aria-label="Platform Statistics" sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#F5F7FB' }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {STATS_DATA.map((stat) => (
            <Grid key={stat.id} item xs={12} sm={6} md={3}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: '20px',
                  p: 2,
                  textAlign: 'center',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0px 8px 24px rgba(0,0,0,0.03)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{
                      fontWeight: 800,
                      color: '#1976D2',
                      fontSize: { xs: '2.25rem', md: '2.75rem' },
                      letterSpacing: '-0.02em',
                      mb: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: '#6B7280', fontWeight: 600 }}>
                    {stat.label}
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