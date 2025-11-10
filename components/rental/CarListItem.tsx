import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RentalCar } from '../../constants/Data';

interface CarListItemProps {
  car: RentalCar;
  onPress: () => void;
  onFavoritePress: () => void;
}

const CarListItem: React.FC<CarListItemProps> = ({ car, onPress, onFavoritePress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Car Image */}
      <Image source={car.image} style={styles.carImage} resizeMode="cover" />

      {/* Car Info */}
      <View style={styles.infoContainer}>
        {/* Car Name and Year */}
        <Text style={styles.carName}>
          {car.name} {car.year}
        </Text>

        {/* Location */}
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={styles.locationText}>{car.location}</Text>
        </View>

        {/* Price and Rating Row */}
        <View style={styles.bottomRow}>
          {/* Price Button */}
          <TouchableOpacity style={styles.priceButton}>
            <Text style={styles.priceText}>N{car.pricePerHour}/hr</Text>
          </TouchableOpacity>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color="#FCD34D" />
            <Text style={styles.ratingText}>{car.rating}</Text>
          </View>
        </View>
      </View>

      {/* Favorite Icon */}
      <TouchableOpacity style={styles.favoriteButton} onPress={onFavoritePress}>
        <Ionicons
          name={car.isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          color={car.isFavorite ? '#EF4444' : '#9CA3AF'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  carImage: {
    width: 120,
    height: 100,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  carName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
    fontFamily: 'Poppins-Regular',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceButton: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 4,
    fontFamily: 'Poppins-Bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
});

export default CarListItem;

