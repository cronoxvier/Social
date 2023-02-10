import { integer } from 'aws-sdk/clients/cloudfront';
import { Model } from 'sequelize';
export interface OccupancyRequestsAttr extends Model {
	id: integer,
	code:string,
	FullName: string,
	DateOfBirth: string,
	SSN: string,
	Phone: string,
	Email: string,
	Address: string,
	City: string,
	State: string,
	Zipcode: string,

	CurrentLandlord: string,

	LandlordPhone: string,

	RentAmount: string,

	MoveInDate: string,

	Expiration: string,

	ReasonForMoving: string,

	AreYouBeingEvicted: boolean,

	WhoShouldWeContactInCaseEmergency: string,

	EmergencyPhone: string,

	EmergencyAddress: string,

	EmergencyCity: string,

	EmergencyState: string,

	EmergencyZipcode: string,

	EmergencyPersonRelationship: string,

	FutureTenant: string,

	FutureTenantBirthDay: string,
	user:string,
	product_pharmacy_id:number,
	isRented:boolean;
	isDocumentSigned:boolean;
}

