
interface IComponent {
    name: string;
    _enabled: boolean;
    enabled: boolean;

    enable(): void;

    disable(): void;


    remove();

    update();
}

export default IComponent;