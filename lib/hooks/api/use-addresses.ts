'use client';

import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import { AddressListParams, City, Country, State } from '../../api/types';
import { buildQueryString, fetcher } from './fetcher';

interface CountriesResponse {
  countries: Country[];
}

interface CitiesResponse {
  cities: City[];
}

interface StatesResponse {
  states: State[];
}

/**
 * Fetch all countries
 */
export function useCountries(params?: AddressListParams) {
  const queryString = buildQueryString(params);
  const key = `/api/addresses/all-countries${queryString}`;

  return useSWR<CountriesResponse>(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000 // 10 minutes - countries don't change
  });
}

/**
 * Fetch all countries (immutable)
 */
export function useCountriesImmutable(params?: AddressListParams) {
  const queryString = buildQueryString(params);
  const key = `/api/addresses/all-countries${queryString}`;

  return useSWRImmutable<CountriesResponse>(key, fetcher);
}

/**
 * Fetch all cities
 */
export function useCities(params?: AddressListParams) {
  const queryString = buildQueryString(params);
  const key = `/api/addresses/all-cities${queryString}`;

  return useSWR<CitiesResponse>(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000 // 10 minutes
  });
}

/**
 * Fetch all cities (immutable)
 */
export function useCitiesImmutable(params?: AddressListParams) {
  const queryString = buildQueryString(params);
  const key = `/api/addresses/all-cities${queryString}`;

  return useSWRImmutable<CitiesResponse>(key, fetcher);
}

/**
 * Fetch all states
 */
export function useStates(params?: AddressListParams) {
  const queryString = buildQueryString(params);
  const key = `/api/addresses/all-states${queryString}`;

  return useSWR<StatesResponse>(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000 // 10 minutes
  });
}

/**
 * Fetch all states (immutable)
 */
export function useStatesImmutable(params?: AddressListParams) {
  const queryString = buildQueryString(params);
  const key = `/api/addresses/all-states${queryString}`;

  return useSWRImmutable<StatesResponse>(key, fetcher);
}

/**
 * Fetch cities by state
 */
export function useCitiesByState(stateId: string | null | undefined, params?: AddressListParams) {
  return useCities(stateId ? { ...params, state_id: stateId } : undefined);
}

/**
 * Fetch states by country
 */
export function useStatesByCountry(
  countryId: string | null | undefined,
  params?: AddressListParams
) {
  return useStates(countryId ? { ...params, country_id: countryId } : undefined);
}

/**
 * Combined hook for address data - fetches countries, states, and cities together
 */
export function useAddressData() {
  const countries = useCountriesImmutable();
  const states = useStatesImmutable();
  const cities = useCitiesImmutable();

  return {
    countries: countries.data?.countries ?? [],
    states: states.data?.states ?? [],
    cities: cities.data?.cities ?? [],
    isLoading: countries.isLoading || states.isLoading || cities.isLoading,
    error: countries.error || states.error || cities.error
  };
}

