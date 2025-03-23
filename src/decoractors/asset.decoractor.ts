const ASSET_METADATA_KEY = 'asset:fields';

export interface AssetFieldOptions {
	multiple?: boolean;
}

export function AssetField(options: AssetFieldOptions = {}) {
	return function (target: any, propertyKey: string) {
		const existingMetadata =
			Reflect.getMetadata(ASSET_METADATA_KEY, target.constructor) || [];

		Reflect.defineMetadata(
			ASSET_METADATA_KEY,
			[
				...existingMetadata,
				{
					propertyKey,
					type: propertyKey,
					multiple: options.multiple ?? false,
				},
			],
			target.constructor,
		);
	};
}

export function getAssetFields(target: any): {
	propertyKey: string;
	type: string;
	multiple: boolean;
}[] {
	return Reflect.getMetadata(ASSET_METADATA_KEY, target.constructor) || [];
}
