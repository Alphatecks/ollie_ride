import { PermissionsAndroid, Platform } from 'react-native';
import Contacts, { Contact as DeviceContact } from 'react-native-contacts';

export interface ContactOption {
  id: string;
  name: string;
  phoneNumber: string;
}

const formatPhoneNumber = (phoneNumber?: string | null) => {
  if (!phoneNumber) {
    return '';
  }
  return phoneNumber.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
};

const extractName = (contact: DeviceContact) => {
  const names = [contact.givenName, contact.middleName, contact.familyName]
    .filter(Boolean)
    .join(' ')
    .trim();
  if (names.length > 0) {
    return names;
  }
  if (contact.displayName && contact.displayName.length > 0) {
    return contact.displayName;
  }
  if (contact.company && contact.company.length > 0) {
    return contact.company;
  }
  return 'Unknown contact';
};

const formatContact = (contact: DeviceContact): ContactOption | null => {
  if (!contact.phoneNumbers || contact.phoneNumbers.length === 0) {
    return null;
  }
  const primaryPhone = contact.phoneNumbers.find((entry) => entry.number) || contact.phoneNumbers[0];
  const sanitizedNumber = formatPhoneNumber(primaryPhone?.number);
  if (!sanitizedNumber) {
    return null;
  }

  return {
    id: contact.recordID,
    name: extractName(contact),
    phoneNumber: sanitizedNumber,
  };
};

export const requestContactsPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Contacts access',
        message: 'Ollie Ride needs access to your contacts to help you share ride details.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
        buttonNeutral: 'Ask me later',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  const status = await Contacts.checkPermission();
  if (status === 'authorized') {
    return true;
  }
  if (status === 'denied') {
    const nextStatus = await Contacts.requestPermission();
    return nextStatus === 'authorized';
  }
  if (status === 'undefined') {
    const nextStatus = await Contacts.requestPermission();
    return nextStatus === 'authorized';
  }

  return false;
};

export const fetchDeviceContacts = async (): Promise<ContactOption[]> => {
  const contacts = await Contacts.getAllWithoutPhotos();
  const formattedContacts = contacts
    .map(formatContact)
    .filter((item): item is ContactOption => Boolean(item));

  return formattedContacts.sort((a, b) => a.name.localeCompare(b.name));
};

