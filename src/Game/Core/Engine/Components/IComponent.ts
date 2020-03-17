
interface IComponent {
    name: string;
    _enabled: boolean;
    enabled: boolean;

    enable(): void;

    disable(): void;


    remove(): void;

    update(): void;
}

export default IComponent;