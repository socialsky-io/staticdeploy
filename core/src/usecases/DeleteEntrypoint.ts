import { EntrypointNotFoundError } from "../common/errors";
import Usecase from "../common/Usecase";
import { Operation } from "../entities/OperationLog";

export default class DeleteEntrypoint extends Usecase {
    async exec(id: string): Promise<void> {
        const toBeDeletedEntrypoint = await this.storages.entrypoints.findOne(
            id
        );

        // Ensure the entrypoint exists
        if (!toBeDeletedEntrypoint) {
            throw new EntrypointNotFoundError(id, "id");
        }

        // Auth check
        this.authorizer.ensureCanDeleteEntrypoint(
            id,
            toBeDeletedEntrypoint.appId
        );

        // Delete the entrypoint
        await this.storages.entrypoints.deleteOne(id);

        // Log the operation
        await this.operationLogger.logOperation(Operation.deleteEntrypoint, {
            deletedEntrypoint: toBeDeletedEntrypoint
        });
    }
}
