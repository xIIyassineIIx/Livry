package com.dsi.livry.problem;

public enum ProblemType {
    // Problèmes signalés par le chauffeur
    DELIVERY_DELAY,      // Retard de livraison
    ACCIDENT,            // Accident du chauffeur
    CLIENT_UNREACHABLE,  // Client injoignable

    // Problèmes signalés par le client
    NON_DELIVERED,       // Livraison non reçue
    DAMAGED_PACKAGE,     // Colis endommagé

    OTHER                // Autre problème
}
