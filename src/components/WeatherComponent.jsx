import React, {useEffect, useState} from 'react'
import AlgoliaPlaces from 'algolia-places-react';
import {apiKey, appId, apiKeyAlgolia} from '../environment';

function WeatherComponent() {
	let [error, setError] = useState('')
	
	let [currentTemperature, setCurrentTemperature] = useState({
		temp: '1',
		feels_like: '-1',
		description: 'snowing',
		icon: '13n'
	})
	
	let [location, setLocation] = useState({
		name: 'Tala, MX',
		lat: 20.67,
		lon: -103.7
	});
	
	useEffect(() => {
		fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric`)
			.then(res => res.json())
			.then(data => {
				let {description, icon} = data.weather[0];
				let {temp, feels_like} = data.main
				setCurrentTemperature({temp, feels_like, description, icon});
				setLocation({
					name: `${data.name}, ${data.sys.country}`,
					lat: data.coord.lat,
					lon: data.coord.lon
				});
			})
			.catch(reason => {
				setError('this account is temporary blocked due to exceeding of requests limitation of your subscription type')
			});
	}, [location.lat, location.lon]);
	
	return (
		<div className="text-white mt-32">
			{error &&
			<div className="bg-red-100 border-t-4 md:w-128 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md"
					 role="alert">
				<div className="flex">
					<div className="py-1">
						<svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg"
								 viewBox="0 0 20 20">
							<path
								d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
						</svg>
					</div>
					<div>
						<p className="font-bold">Something seriously bad happened.</p>
						<p className="text-sm">{error}.</p>
					</div>
				</div>
			</div>
			}
			<div className="places-input text-gray-800 mt-5">
				<AlgoliaPlaces
					placeholder='Write an address here'
					options={{
						appId: appId,
						apiKey: apiKeyAlgolia,
						aroundLatLngViaIP: false
					}}
					onChange={({suggestion}) => {
						setLocation({
							name: `${suggestion.name}, ${suggestion.countryCode.toUpperCase()}`,
							lat: suggestion.latlng.lat,
							lon: suggestion.latlng.lng
						});
					}}
				/>
			</div>
			<div
				className="container mx-auto font-sans md:w-128 max-w-lg rounded-lg overflow-hidden bg-gray-900 shadow-lg mt-8">
				<div className="current-weather flex items-center justify-between px-6 py-8">
					<div className="flex flex-col md:flex-row items-center">
						<div>
							<div className="text-6xl font-semibold">{currentTemperature.temp}°C</div>
							<div>Feels like {currentTemperature.feels_like}°C</div>
						</div>
						<div className="md:mx-5">
							<div className="font-semibold">{currentTemperature.description}</div>
							<div>{location.name}</div>
						</div>
					</div>
					<div>
						<img src={`http://openweathermap.org/img/wn/${currentTemperature.icon}.png`} width="60" height="60"/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default WeatherComponent;