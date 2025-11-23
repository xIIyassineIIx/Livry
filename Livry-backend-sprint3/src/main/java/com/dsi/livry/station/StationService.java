package com.dsi.livry.station;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StationService {

    private final StationRepository repository;

    public StationService(StationRepository repository) {
        this.repository = repository;
    }

    public Station createStation(Station station) {
        return repository.save(station);
    }

    public Station updateStation(Long id, Station stationDetails) {
        Station station = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Station introuvable"));
        station.setName(stationDetails.getName());
        station.setRegion(stationDetails.getRegion());
        return repository.save(station);
    }

    public void deleteStation(Long id) {
        Station station = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Station introuvable"));
        repository.delete(station);
    }

    public List<Station> getAllStations() {
        return repository.findAll();
    }

    public Station getStationById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Station introuvable"));
    }
}
