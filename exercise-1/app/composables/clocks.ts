
export const useClock = () => {
  const clocks = useState('clocks-list', () => [
    { id: 1, name: 'Consistency', imageUrl: 'https://d2pn8kiwq2w21t.cloudfront.net/images/Consistency.width-1024.jpg' },
    { id: 2, name: 'Coverage', imageUrl: 'https://d2pn8kiwq2w21t.cloudfront.net/images/Coverage.width-1024.jpg' },
    { id: 3, name: 'Emergency', imageUrl: 'https://d2pn8kiwq2w21t.cloudfront.net/images/Emergency.width-1024.jpg' },
    { id: 4, name: 'Collapse', imageUrl: 'https://d2pn8kiwq2w21t.cloudfront.net/images/Collapse.width-1024.jpg' },
    { id: 5, name: 'Sea Level Rise', imageUrl: 'https://d2pn8kiwq2w21t.cloudfront.net/images/RisingWater.width-1024.jpg' },
    { id: 6, name: 'Repletion and Depletion', imageUrl: 'https://d2pn8kiwq2w21t.cloudfront.net/images/Agriculture.width-1024.jpg' },
    { id: 7, name: 'Deforestation', imageUrl: 'https://d2pn8kiwq2w21t.cloudfront.net/images/Deforestation.width-1024.jpg' },
    { id: 8, name: 'Air Quality', imageUrl: 'https://d2pn8kiwq2w21t.cloudfront.net/images/Pollution.width-1024.jpg' },
    { id: 9, name: 'Sinkhole', imageUrl: 'https://d2pn8kiwq2w21t.cloudfront.net/images/Sinkhole.width-1024.jpg' },
    { id: 10, name: 'Earthquake', imageUrl: 'https://d2pn8kiwq2w21t.cloudfront.net/images/Earthquake.width-1024.jpg' },
    { id: 11, name: 'Earth in Flux', imageUrl: 'https://d2pn8kiwq2w21t.cloudfront.net/images/Illusion.width-1024.jpg' },
    { id: 12, name: 'Precision', imageUrl: 'https://d2pn8kiwq2w21t.cloudfront.net/images/Precision.width-1024.jpg' },
  ])

  const selectedClock = useState('selected-clock', () => null as any);

  const selectClock = (clock: number) => {
    selectedClock.value = clock;
  };

  return {
    clocks,
    selectedClock,
    selectClock
  };
};