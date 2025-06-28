import { useEffect, useState } from 'react';
import { City, Country, State } from '../api/types';

interface UseAddressCascadeProps {
  countries: Country[];
  states: State[];
  cities: City[];
  selectedCountry: string;
  selectedState: string;
}

interface UseAddressCascadeReturn {
  availableStates: State[];
  availableCities: City[];
  clearState: () => void;
  clearCity: () => void;
}

export function useAddressCascade({
  countries,
  states,
  cities,
  selectedCountry,
  selectedState
}: UseAddressCascadeProps): UseAddressCascadeReturn {
  const [availableStates, setAvailableStates] = useState<State[]>([]);
  const [availableCities, setAvailableCities] = useState<City[]>([]);

  // Filter states based on selected country
  useEffect(() => {
    if (selectedCountry) {
      const selectedCountryObj = countries.find((c) => c.name === selectedCountry);
      if (selectedCountryObj) {
        const filteredStates = states.filter((s) => s.country_id === selectedCountryObj.id);
        setAvailableStates(filteredStates);
      }
    } else {
      setAvailableStates([]);
    }
  }, [selectedCountry, countries, states]);

  // Filter cities based on selected state
  useEffect(() => {
    if (selectedState) {
      const selectedStateObj = availableStates.find((s) => s.name === selectedState);
      if (selectedStateObj) {
        const filteredCities = cities.filter((c) => c.state_id === selectedStateObj.id);
        setAvailableCities(filteredCities);
      }
    } else {
      setAvailableCities([]);
    }
  }, [selectedState, availableStates, cities]);

  const clearState = () => {
    setAvailableStates([]);
  };

  const clearCity = () => {
    setAvailableCities([]);
  };

  return {
    availableStates,
    availableCities,
    clearState,
    clearCity
  };
}
